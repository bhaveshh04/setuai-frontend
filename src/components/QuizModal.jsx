import { useState } from "react";
import { generateQuiz } from "../services/chatService";

export default function QuizModal({ onClose, defaultSubject }) {
  const [topic, setTopic]           = useState(defaultSubject || "");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount]           = useState(5);
  const [quiz, setQuiz]             = useState(null);
  const [answers, setAnswers]       = useState({});
  const [submitted, setSubmitted]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [score, setScore]           = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    try {
      const { data } = await generateQuiz(topic, difficulty, count);
      setQuiz(data);
    } catch {
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#2a2a3e] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-white font-bold text-lg">🧪 AI Quiz Generator</h2>
            <p className="text-slate-400 text-xs mt-0.5">Powered by Groq LLaMA 3</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">

          {/* Quiz Config */}
          {!quiz && (
            <>
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Topic</label>
                <input
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Newton's Laws, Quadratic Equations..."
                  className="w-full bg-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-slate-400 mb-1.5 block">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                    className="w-full bg-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm border border-white/10 focus:outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-slate-400 mb-1.5 block">Questions: {count}</label>
                  <input
                    type="range" min="1" max="10" value={count}
                    onChange={e => setCount(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !topic.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white py-3 rounded-xl font-medium text-sm transition"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating quiz...
                  </span>
                ) : "Generate Quiz →"}
              </button>
            </>
          )}

          {/* Quiz Questions */}
          {quiz && !submitted && (
            <>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-semibold">{quiz.topic}</h3>
                <button
                  onClick={() => setQuiz(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >← New Quiz</button>
              </div>

              {quiz.questions?.map((q, i) => (
                <div key={i} className="bg-[#1e1e2e] rounded-xl p-4 border border-white/5">
                  <p className="text-white text-sm font-medium mb-3">
                    {i + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options?.map((opt, j) => (
                      <button
                        key={j}
                        onClick={() => setAnswers(prev => ({ ...prev, [i]: opt }))}
                        className={`w-full text-left text-sm px-4 py-2.5 rounded-lg transition border ${
                          answers[i] === opt
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < quiz.questions?.length}
                className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white py-3 rounded-xl font-medium text-sm transition"
              >
                Submit Quiz ({Object.keys(answers).length}/{quiz.questions?.length} answered)
              </button>
            </>
          )}

          {/* Results */}
          {submitted && quiz && (
            <>
              <div className={`text-center p-6 rounded-xl ${
                score >= quiz.questions.length * 0.7
                  ? "bg-green-500/10 border border-green-500/20"
                  : "bg-amber-500/10 border border-amber-500/20"
              }`}>
                <p className="text-3xl font-bold text-white">{score}/{quiz.questions.length}</p>
                <p className={`text-sm mt-1 ${score >= quiz.questions.length * 0.7 ? "text-green-400" : "text-amber-400"}`}>
                  {score >= quiz.questions.length * 0.7 ? "🎉 Great work!" : "📖 Keep practicing!"}
                </p>
              </div>

              {quiz.questions.map((q, i) => (
                <div key={i} className="bg-[#1e1e2e] rounded-xl p-4 border border-white/5">
                  <p className="text-white text-sm font-medium mb-2">{i + 1}. {q.question}</p>
                  <div className="space-y-1.5">
                    {q.options?.map((opt, j) => {
                      const isCorrect = opt === q.correctAnswer;
                      const isSelected = answers[i] === opt;
                      return (
                        <div key={j} className={`text-sm px-4 py-2 rounded-lg border ${
                          isCorrect
                            ? "bg-green-500/15 border-green-500/30 text-green-300"
                            : isSelected
                            ? "bg-red-500/15 border-red-500/30 text-red-300"
                            : "bg-white/5 border-white/5 text-slate-400"
                        }`}>
                          {opt} {isCorrect ? "✓" : isSelected ? "✗" : ""}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 italic">💡 {q.explanation}</p>
                </div>
              ))}

              <div className="flex gap-2">
                <button
                  onClick={() => { setQuiz(null); setSubmitted(false); }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-medium transition"
                >
                  New Quiz
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-sm font-medium transition"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}