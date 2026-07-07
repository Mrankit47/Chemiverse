from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

app = FastAPI(title="ChemiVerse API")
api_router = APIRouter(prefix="/api")


# ----------------------- Models -----------------------
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class ChatRequest(BaseModel):
    session_id: str
    message: str


class QuizResult(BaseModel):
    user_id: str
    topic: str
    score: int
    total: int


class ProgressUpdate(BaseModel):
    user_id: str
    module: str
    xp: int = 0
    achievement: Optional[str] = None


# ----------------------- Basic -----------------------
@api_router.get("/")
async def root():
    return {"message": "ChemiVerse API online", "status": "ok"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(**input.model_dump())
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.status_checks.insert_one(doc)
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for c in checks:
        if isinstance(c['timestamp'], str):
            c['timestamp'] = datetime.fromisoformat(c['timestamp'])
    return checks


# ----------------------- AI Tutor -----------------------
TUTOR_SYSTEM = (
    "You are ChemiBot, the AI chemistry tutor inside ChemiVerse — an immersive 3D "
    "chemistry learning universe. You explain chemistry concepts (atomic structure, the "
    "periodic table, bonding, reactions, organic chemistry, thermodynamics, stoichiometry) "
    "clearly and enthusiastically for students. Use analogies, keep answers concise and "
    "well structured with short paragraphs or bullet points. Use simple markdown. When "
    "relevant, suggest which ChemiVerse module to explore (Periodic Galaxy, Atom Viewer, "
    "Molecule Viewer, Reaction Simulator, Virtual Lab, Quiz). Never invent unsafe lab "
    "instructions; always emphasise safety."
)


async def tutor_stream(session_id: str, message: str):
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=TUTOR_SYSTEM,
    ).with_model("anthropic", "claude-sonnet-4-6")

    # load prior history into this fresh instance
    prior = await db.tutor_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("ts", 1).to_list(200)

    full = ""
    try:
        async for event in chat.stream_message(UserMessage(text=message)):
            if isinstance(event, TextDelta):
                full += event.content
                yield f"data: {json.dumps({'delta': event.content})}\n\n"
            elif isinstance(event, StreamDone):
                break
    except Exception as e:
        logging.exception("tutor stream error")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
        return

    now = datetime.now(timezone.utc).isoformat()
    await db.tutor_messages.insert_many([
        {"id": str(uuid.uuid4()), "session_id": session_id, "role": "user", "content": message, "ts": now},
        {"id": str(uuid.uuid4()), "session_id": session_id, "role": "assistant", "content": full, "ts": now},
    ])
    yield f"data: {json.dumps({'done': True})}\n\n"


@api_router.post("/tutor/chat")
async def tutor_chat(req: ChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="LLM key not configured")
    return StreamingResponse(
        tutor_stream(req.session_id, req.message),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@api_router.get("/tutor/history/{session_id}")
async def tutor_history(session_id: str):
    msgs = await db.tutor_messages.find(
        {"session_id": session_id}, {"_id": 0}
    ).sort("ts", 1).to_list(200)
    return msgs


# ----------------------- Progress & Gamification -----------------------
@api_router.get("/progress/{user_id}")
async def get_progress(user_id: str):
    doc = await db.progress.find_one({"user_id": user_id}, {"_id": 0})
    if not doc:
        doc = {"user_id": user_id, "xp": 0, "modules": [], "achievements": [], "quiz": []}
    return doc


@api_router.post("/progress")
async def update_progress(upd: ProgressUpdate):
    doc = await db.progress.find_one({"user_id": upd.user_id}, {"_id": 0})
    if not doc:
        doc = {"user_id": upd.user_id, "xp": 0, "modules": [], "achievements": [], "quiz": []}
    doc["xp"] = doc.get("xp", 0) + upd.xp
    if upd.module and upd.module not in doc["modules"]:
        doc["modules"].append(upd.module)
    if upd.achievement and upd.achievement not in doc["achievements"]:
        doc["achievements"].append(upd.achievement)
    await db.progress.update_one({"user_id": upd.user_id}, {"$set": doc}, upsert=True)
    return doc


@api_router.post("/quiz/submit")
async def submit_quiz(result: QuizResult):
    doc = await db.progress.find_one({"user_id": result.user_id}, {"_id": 0})
    if not doc:
        doc = {"user_id": result.user_id, "xp": 0, "modules": [], "achievements": [], "quiz": []}
    xp_gain = result.score * 10
    doc["xp"] = doc.get("xp", 0) + xp_gain
    doc.setdefault("quiz", []).append({
        "topic": result.topic, "score": result.score, "total": result.total,
        "ts": datetime.now(timezone.utc).isoformat(),
    })
    if result.score == result.total and "Perfect Score" not in doc.get("achievements", []):
        doc.setdefault("achievements", []).append("Perfect Score")
    await db.progress.update_one({"user_id": result.user_id}, {"$set": doc}, upsert=True)
    return {"xp_gain": xp_gain, "progress": doc}


@api_router.get("/leaderboard")
async def leaderboard():
    top = await db.progress.find({}, {"_id": 0, "user_id": 1, "xp": 1}).sort("xp", -1).to_list(20)
    return top


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
