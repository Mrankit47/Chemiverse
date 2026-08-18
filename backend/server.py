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

mongo_url = os.environ.get('MONGO_URL', '')
db_name = os.environ.get('DB_NAME', 'chemiverse')

# In-Memory Fallback Mock MongoDB client for environments where MongoDB is not running locally
class MockCursor:
    def __init__(self, data, sort_key=None, sort_dir=1):
        self.data = data
        self.sort_key = sort_key
        self.sort_dir = sort_dir

    def sort(self, key, direction=1):
        self.sort_key = key
        self.sort_dir = direction
        return self

    async def to_list(self, length):
        res = list(self.data)
        if self.sort_key:
            res.sort(key=lambda x: x.get(self.sort_key) if x.get(self.sort_key) is not None else 0, reverse=(self.sort_dir == -1))
        return res[:length]

class MockCollection:
    def __init__(self, name):
        self.name = name
        self.docs = []

    async def insert_one(self, doc):
        self.docs.append(doc.copy())
        return self

    async def insert_many(self, docs):
        for d in docs:
            self.docs.append(d.copy())
        return self

    def find(self, spec=None, projection=None):
        spec = spec or {}
        matched = []
        for d in self.docs:
            match = True
            for k, v in spec.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                proj_d = d.copy()
                if projection:
                    for pk, pv in projection.items():
                        if pv == 0 and pk in proj_d:
                            proj_d.pop(pk)
                matched.append(proj_d)
        return MockCursor(matched)

    async def find_one(self, spec, projection=None):
        cursor = self.find(spec, projection)
        matched = await cursor.to_list(1)
        return matched[0] if matched else None

    async def update_one(self, spec, update, upsert=False):
        found_idx = -1
        for idx, d in enumerate(self.docs):
            match = True
            for k, v in spec.items():
                if d.get(k) != v:
                    match = False
                    break
            if match:
                found_idx = idx
                break

        if found_idx == -1:
            if upsert:
                new_doc = spec.copy()
                if "$set" in update:
                    for k, v in update["$set"].items():
                        new_doc[k] = v
                self.docs.append(new_doc)
            return self

        doc = self.docs[found_idx]
        if "$set" in update:
            for k, v in update["$set"].items():
                doc[k] = v
        return self

class MockDB:
    def __init__(self):
        self.collections = {}

    def __getattr__(self, name):
        if name not in self.collections:
            self.collections[name] = MockCollection(name)
        return self.collections[name]

    def __getitem__(self, name):
        return self.__getattr__(name)

class MockAsyncIOMotorClient:
    def __init__(self, uri=None):
        self.db = MockDB()

    def __getitem__(self, name):
        return self.db

import socket
def is_port_open(host, port):
    try:
        with socket.create_connection((host, port), timeout=1.0):
            return True
    except Exception:
        return False

# Parse host/port from mongo_url
use_mock = True
if mongo_url:
    try:
        if "localhost" in mongo_url or "127.0.0.1" in mongo_url:
            port = 27017
            parts = mongo_url.split("//")[-1].split("/")
            if ":" in parts[0]:
                port = int(parts[0].split(":")[-1])
            if is_port_open("localhost", port):
                use_mock = False
        else:
            use_mock = False
    except Exception:
        pass

if use_mock:
    logging.warning("MongoDB port is not reachable. Initializing in-memory Mock MongoDB fallback.")
    client = MockAsyncIOMotorClient()
    db = client[db_name]
else:
    logging.info(f"Connecting to MongoDB at: {mongo_url}")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')
GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')
GROQ_MODEL = os.environ.get('GROQ_MODEL', 'llama-3.3-70b-versatile')
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY', '')

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
    # Resolve provider and key (Groq priority, then Anthropic/Emergent, then smart mock)
    groq_key = os.environ.get('GROQ_API_KEY', '')
    groq_model = os.environ.get('GROQ_MODEL', 'llama-3.3-70b-versatile')
    emergent_key = os.environ.get('EMERGENT_LLM_KEY', '')
    anthropic_key = os.environ.get('ANTHROPIC_API_KEY', '')

    if groq_key and not groq_key.startswith('your-'):
        chat = LlmChat(
            api_key=groq_key,
            session_id=session_id,
            system_message=TUTOR_SYSTEM,
        ).with_model("groq", groq_model)
    elif anthropic_key and not anthropic_key.startswith('your-'):
        chat = LlmChat(
            api_key=anthropic_key,
            session_id=session_id,
            system_message=TUTOR_SYSTEM,
        ).with_model("anthropic", "claude-3-5-sonnet-20241022")
    elif emergent_key and not emergent_key.startswith('your-'):
        chat = LlmChat(
            api_key=emergent_key,
            session_id=session_id,
            system_message=TUTOR_SYSTEM,
        ).with_model("anthropic", "claude-sonnet-4-6")
    else:
        chat = LlmChat(
            api_key="",
            session_id=session_id,
            system_message=TUTOR_SYSTEM,
        )

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
