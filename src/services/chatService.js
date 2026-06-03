import axios from "axios";

// 🚨 Hardcoded absolute URL so it ALWAYS goes to Render
const API = "https://setuai-backend-7z3l.onrender.com";
export const sendMessage = (sessionId, message, subject) =>
  axios.post(`${API}/api/chat/send`, { sessionId, message, subject });

export const getSessions = () =>
  axios.get(`${API}/api/chat/sessions`);

export const getMessages = (sessionId) =>
  axios.get(`${API}/api/chat/sessions/${sessionId}/messages`);

export const generateQuiz = (topic, difficulty = "medium", numberOfQuestions = 5) =>
  axios.post(`${API}/api/quiz/generate`, { topic, difficulty, numberOfQuestions });