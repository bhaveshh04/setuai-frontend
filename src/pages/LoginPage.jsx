import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim())    return setError("Email is required");
    if (!password.trim()) return setError("Password is required");

    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e2e] px-4">
      <div className="w-full max-w-md bg-[#2a2a3e] rounded-2xl p-8 border border-white/10">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
            S
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in to continue learning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 ml-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm border border-white/10
                         focus:outline-none focus:border-indigo-500 transition placeholder-slate-600"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm border border-white/10
                         focus:outline-none focus:border-indigo-500 transition placeholder-slate-600"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <span className="text-red-400 text-xs">⚠</span>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                       text-white py-3 rounded-xl font-medium text-sm transition-all duration-200 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : "Sign In"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-slate-500 text-xs">don't have an account?</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <Link
          to="/register"
          className="block w-full text-center py-3 rounded-xl border border-white/10 text-slate-300
                     hover:bg-white/5 hover:border-white/20 text-sm font-medium transition-all duration-200"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
