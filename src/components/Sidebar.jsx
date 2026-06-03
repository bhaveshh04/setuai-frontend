import { useEffect, useState } from "react";
import { getSessions } from "../services/chatService";
import { useAuth } from "../context/useAuth";

export default function Sidebar({ activeId, onSelect, onNew }) {
  const [sessions, setSessions] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    getSessions()
      .then(({ data }) => setSessions(data))
      .catch(() => setSessions([]));
  }, [activeId]);

  return (
    <div className="w-64 bg-[#2a2a3e] border-r border-white/10 flex flex-col h-screen">

      {/* Logo */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
          <div>
            <p className="text-white font-bold text-sm">SETU.AI</p>
            <p className="text-slate-500 text-xs">RAG Tutor</p>
          </div>
        </div>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2.5 rounded-xl transition font-medium"
        >
          + New Chat
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1">
        <p className="text-xs text-slate-500 px-2 py-1 uppercase tracking-wider">Recent Chats</p>
        {sessions.length === 0 && (
          <p className="text-xs text-slate-600 px-2 py-4 text-center">No chats yet</p>
        )}
        {sessions.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${
              activeId === s.id
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-white/10"
            }`}
          >
            <p className="truncate font-medium">{s.title || "New Conversation"}</p>
            <p className="text-xs opacity-60 mt-0.5">
              {s.updatedAt ? new Date(s.updatedAt).toLocaleDateString() : ""}
            </p>
          </button>
        ))}
      </div>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="w-8 h-8 bg-indigo-500/30 rounded-full flex items-center justify-center text-indigo-300 text-xs font-bold">
            {user?.fullName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.fullName || "User"}</p>
            <p className="text-slate-500 text-xs truncate">{user?.email || ""}</p>
          </div>
          <button
            onClick={logout}
            className="text-slate-500 hover:text-red-400 text-xs transition"
            title="Logout"
          >
            ⏻
          </button>
        </div>
      </div>
    </div>
  );
}
