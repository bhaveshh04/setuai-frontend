import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/useAuth";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function ChatLayout() {
  const [activeSession, setActiveSession] = useState(null);
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeId={activeSession}
        onSelect={setActiveSession}
        onNew={() => setActiveSession(null)}
      />
      <div className="flex-1">
        <ChatWindow
          sessionId={activeSession}
          onNewSession={setActiveSession}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatLayout />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
