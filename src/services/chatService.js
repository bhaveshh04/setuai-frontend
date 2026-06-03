import axios from "axios";
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const sendMessage = (sessionId, message, subject) =>
  axios.post(`${API}/api/chat/send`, { sessionId, message, subject });

export const getSessions = () =>
  axios.get(`${API}/api/chat/sessions`);

export const getMessages = (sessionId) =>
  axios.get(`${API}/api/chat/sessions/${sessionId}/messages`);

export const generateQuiz = (topic, difficulty = "medium", numberOfQuestions = 5) =>
  axios.post(`${API}/api/quiz/generate`, { topic, difficulty, numberOfQuestions });