import { useState, useRef, useEffect } from "react";
import { sendMessage, getMessages } from "../services/chatService";
import ReactMarkdown from "react-markdown";
import Avatar from "./Avatar";
import QuizModal from "./QuizModal";

export default function ChatWindow({ sessionId, onNewSession }) {
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [lastAiReply, setLastAiReply] = useState("");
  const [subject, setSubject]         = useState("");
  const [showQuiz, setShowQuiz]       = useState(false);
  const bottomRef = useRef(null);

  // Track the previous session ID to detect changes
  const [prevSessionId, setPrevSessionId] = useState(sessionId);

  // 1. Reset state synchronously DURING the render phase if the session is cleared
  if (sessionId !== prevSessionId) {
    setPrevSessionId(sessionId);
    if (!sessionId) {
      setMessages([]);
      setLastAiReply("");
    }
  }

  // 2. Load messages only when a valid sessionId exists (Async part only)
  useEffect(() => {
    if (sessionId) {
      getMessages(sessionId)
        .then(({ data }) => {
          const nextMessages = data.map(m => ({ role: m.role, content: m.content }));
          setMessages(nextMessages);
          const lastAssistantMessage = [...nextMessages]
            .reverse()
            .find(message => message.role === "assistant");
          setLastAiReply(lastAssistantMessage?.content || "");
        })
        .catch(() => {
          setMessages([]);
          setLastAiReply("");
        });
    }
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    const sentInput = input;
    setInput("");
    setLoading(true);

    try {
      const isNewSession = !sessionId;
      const { data } = await sendMessage(sessionId, sentInput, subject || null);
      const aiMsg = { role: "assistant", content: data.aiResponse };
      setMessages(prev => [...prev, aiMsg]);
      setLastAiReply(data.aiResponse);
      if (isNewSession && data.sessionId) {
        onNewSession?.(data.sessionId);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const subjects = ["Math", "Physics", "Chemistry", "Biology", "History", "Coding", "General"];

  return (
    <div className="flex flex-col h-screen bg-[#1e1e2e]">

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-3 border-b border-white/10 bg-[#2a2a3e]">
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">S</div>
        <div>
          <span className="font-semibold text-white text-sm">SETU.AI Tutor</span>
          <p className="text-xs text-slate-400">RAG-powered • Groq LLaMA 3</p>
        </div>
        <Avatar text={lastAiReply} />
        <button
          onClick={() => setShowQuiz(true)}
          className="ml-auto bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition"
        >
          🧪 Take Quiz
        </button>
      </div>

      {/* Subject selector */}
      <div className="flex gap-2 px-4 py-2 bg-[#2a2a3e] border-b border-white/5 overflow-x-auto">
        {subjects.map(s => (
          <button
            key={s}
            onClick={() => setSubject(subject === s ? "" : s)}
            className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition ${
              subject === s
                ? "bg-indigo-600 text-white"
                : "bg-white/10 text-slate-300 hover:bg-white/20"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 mt-20">
            <p className="text-4xl mb-4">🎓</p>
            <p className="text-xl font-semibold text-white">Hi, I'm SETU!</p>
            <p className="mt-2 text-sm">Your AI tutor powered by RAG + LLaMA 3</p>
            <p className="text-xs text-slate-500 mt-1">Select a subject above and ask me anything</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1 flex-shrink-0">S</div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed
              ${msg.role === "user"
                ? "bg-indigo-600 text-white rounded-tr-none"
                : "bg-[#2a2a3e] text-slate-200 rounded-tl-none border border-white/10"}`}>
              {msg.role === "assistant"
                ? (
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{msg.content || ""}</ReactMarkdown>
                  </div>
                )
                : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0">S</div>
            <div className="bg-[#2a2a3e] border border-white/10 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1 items-center">
                <span className="text-xs text-slate-400 mr-2">SETU is thinking</span>
                {[0,1,2].map(i => (
                  <span key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/10 bg-[#2a2a3e]">
        {subject && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-indigo-400">📚 Teaching: {subject}</span>
            <button onClick={() => setSubject("")} className="text-xs text-slate-500 hover:text-white">✕ clear</button>
          </div>
        )}
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <textarea
            className="flex-1 bg-[#1e1e2e] text-white rounded-xl px-4 py-3 resize-none text-sm border border-white/10 focus:outline-none focus:border-indigo-500 transition min-h-[48px] max-h-32 placeholder-slate-600"
            rows={1}
            placeholder={subject ? `Ask me about ${subject}...` : "Ask SETU anything..."}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-5 py-3 rounded-xl text-sm font-medium transition"
          >
            Send
          </button>
        </div>
        <p className="text-center text-xs text-slate-500 mt-2">RAG-powered by Groq LLaMA 3 · SETU.AI</p>
      </div>

      {/* Quiz Modal */}
      {showQuiz && <QuizModal onClose={() => setShowQuiz(false)} defaultSubject={subject} />}
    </div>
  );
}