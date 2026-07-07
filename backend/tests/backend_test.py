"""ChemiVerse backend API tests"""
import os
import json
import uuid
import time
import requests
import pytest

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://bio-carbon-track.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def user_id():
    return f"TEST_user_{uuid.uuid4().hex[:8]}"


@pytest.fixture(scope="session")
def session_id():
    return f"TEST_sess_{uuid.uuid4().hex[:8]}"


# ---------- Root ----------
class TestRoot:
    def test_root_online(self):
        r = requests.get(f"{API}/", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data.get("status") == "ok"
        assert "ChemiVerse" in data.get("message", "")


# ---------- Progress & Gamification ----------
class TestProgress:
    def test_get_progress_default(self, user_id):
        r = requests.get(f"{API}/progress/{user_id}", timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["user_id"] == user_id
        assert data["xp"] == 0
        assert data["modules"] == []
        assert data["achievements"] == []

    def test_update_progress_accumulates(self, user_id):
        # First update
        r1 = requests.post(f"{API}/progress", json={
            "user_id": user_id, "module": "atom-viewer", "xp": 50,
            "achievement": "First Step"
        }, timeout=15)
        assert r1.status_code == 200
        d1 = r1.json()
        assert d1["xp"] == 50
        assert "atom-viewer" in d1["modules"]
        assert "First Step" in d1["achievements"]

        # Second update (same module + achievement should not duplicate; xp accumulates)
        r2 = requests.post(f"{API}/progress", json={
            "user_id": user_id, "module": "atom-viewer", "xp": 25,
            "achievement": "First Step"
        }, timeout=15)
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["xp"] == 75
        assert d2["modules"].count("atom-viewer") == 1
        assert d2["achievements"].count("First Step") == 1

        # Third update (new module, new achievement)
        r3 = requests.post(f"{API}/progress", json={
            "user_id": user_id, "module": "quiz", "xp": 10,
            "achievement": "Quiz Novice"
        }, timeout=15)
        assert r3.status_code == 200
        d3 = r3.json()
        assert d3["xp"] == 85
        assert set(["atom-viewer", "quiz"]).issubset(set(d3["modules"]))
        assert "Quiz Novice" in d3["achievements"]

        # GET verification
        g = requests.get(f"{API}/progress/{user_id}", timeout=15)
        assert g.status_code == 200
        gd = g.json()
        assert gd["xp"] == 85


class TestQuizSubmit:
    def test_quiz_submit_partial(self):
        uid = f"TEST_quiz_{uuid.uuid4().hex[:8]}"
        r = requests.post(f"{API}/quiz/submit", json={
            "user_id": uid, "topic": "atoms", "score": 3, "total": 5
        }, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["xp_gain"] == 30
        assert data["progress"]["xp"] == 30
        assert "Perfect Score" not in data["progress"]["achievements"]
        assert data["progress"]["quiz"][-1]["topic"] == "atoms"
        assert data["progress"]["quiz"][-1]["score"] == 3

    def test_quiz_submit_perfect_awards_achievement(self):
        uid = f"TEST_perfect_{uuid.uuid4().hex[:8]}"
        r = requests.post(f"{API}/quiz/submit", json={
            "user_id": uid, "topic": "bonding", "score": 5, "total": 5
        }, timeout=15)
        assert r.status_code == 200
        data = r.json()
        assert data["xp_gain"] == 50
        assert "Perfect Score" in data["progress"]["achievements"]

        # Second perfect submission should not duplicate achievement
        r2 = requests.post(f"{API}/quiz/submit", json={
            "user_id": uid, "topic": "reactions", "score": 4, "total": 4
        }, timeout=15)
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["progress"]["achievements"].count("Perfect Score") == 1
        assert d2["progress"]["xp"] == 50 + 40


class TestLeaderboard:
    def test_leaderboard_sorted(self):
        # seed a couple of users with different xp
        u1 = f"TEST_lb1_{uuid.uuid4().hex[:6]}"
        u2 = f"TEST_lb2_{uuid.uuid4().hex[:6]}"
        requests.post(f"{API}/progress", json={"user_id": u1, "module": "m1", "xp": 500}, timeout=15)
        requests.post(f"{API}/progress", json={"user_id": u2, "module": "m1", "xp": 100}, timeout=15)

        r = requests.get(f"{API}/leaderboard", timeout=15)
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list)
        # verify sorted descending by xp
        xps = [x["xp"] for x in arr]
        assert xps == sorted(xps, reverse=True)


# ---------- Tutor SSE ----------
class TestTutor:
    def test_tutor_stream_and_history(self, session_id):
        payload = {"session_id": session_id, "message": "In one short sentence, what is an atom?"}
        deltas = []
        done = False
        error = None
        with requests.post(f"{API}/tutor/chat", json=payload, stream=True, timeout=90) as r:
            assert r.status_code == 200, f"tutor/chat returned {r.status_code}: {r.text[:200]}"
            for raw in r.iter_lines(decode_unicode=True):
                if not raw:
                    continue
                if raw.startswith("data: "):
                    body = raw[6:]
                    try:
                        obj = json.loads(body)
                    except Exception:
                        continue
                    if "delta" in obj:
                        deltas.append(obj["delta"])
                    if obj.get("done"):
                        done = True
                        break
                    if "error" in obj:
                        error = obj["error"]
                        break
        assert error is None, f"SSE error: {error}"
        assert done, "Stream did not emit done:true"
        assert len(deltas) > 0, "No delta tokens received"
        full = "".join(deltas)
        assert len(full.strip()) > 0

        # give DB a moment to write, then check history
        time.sleep(1.0)
        h = requests.get(f"{API}/tutor/history/{session_id}", timeout=15)
        assert h.status_code == 200
        msgs = h.json()
        assert isinstance(msgs, list)
        assert len(msgs) >= 2
        roles = [m["role"] for m in msgs]
        assert "user" in roles and "assistant" in roles
        # last user message should match what we sent
        user_msgs = [m for m in msgs if m["role"] == "user"]
        assert any(payload["message"] in m["content"] for m in user_msgs)
