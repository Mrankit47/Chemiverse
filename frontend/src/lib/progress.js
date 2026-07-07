import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export function getUserId() {
  let id = localStorage.getItem("cv_uid");
  if (!id) {
    id = "explorer-" + Math.random().toString(36).slice(2, 8);
    localStorage.setItem("cv_uid", id);
  }
  return id;
}

export async function getProgress() {
  const { data } = await axios.get(`${API}/progress/${getUserId()}`);
  return data;
}

export async function addProgress({ module, xp = 0, achievement = null }) {
  const { data } = await axios.post(`${API}/progress`, {
    user_id: getUserId(),
    module,
    xp,
    achievement,
  });
  return data;
}

export async function submitQuiz({ topic, score, total }) {
  const { data } = await axios.post(`${API}/quiz/submit`, {
    user_id: getUserId(),
    topic,
    score,
    total,
  });
  return data;
}
