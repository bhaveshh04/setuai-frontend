import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim()) return setError("Full name is required");
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm) return setError("Passwords do not match");

    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data || "Registration failed. Please try again.");
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
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 mt-1 text-sm">Start learning with SETU.AI today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 ml-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full bg-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm border border-white/10
                         focus:outline-none focus:border-indigo-500 transition placeholder-slate-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 ml-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm border border-white/10
                         focus:outline-none focus:border-indigo-500 transition placeholder-slate-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm border border-white/10
                         focus:outline-none focus:border-indigo-500 transition placeholder-slate-600"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 ml-1">Confirm Password</label>
            <input
              type="password"
              name="confirm"
              placeholder="Re-enter your password"
              value={form.confirm}
              onChange={handleChange}
              required
              className="w-full bg-[#1e1e2e] text-white rounded-xl px-4 py-3 text-sm border border-white/10
                         focus:outline-none focus:border-indigo-500 transition placeholder-slate-600"
            />
          </div>

          {/* Password strength indicator */}
          {form.password.length > 0 && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      getStrength(form.password) >= level
                        ? level <= 1 ? "bg-red-500"
                          : level <= 2 ? "bg-amber-500"
                          : level <= 3 ? "bg-yellow-400"
                          : "bg-green-500"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 ml-1">
                {getStrengthLabel(form.password)}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <span className="text-red-400 text-xs">⚠</span>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
                       text-white py-3 rounded-xl font-medium text-sm transition-all duration-200 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-slate-500 text-xs">already have an account?</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Login link */}
        <Link
          to="/login"
          className="block w-full text-center py-3 rounded-xl border border-white/10 text-slate-300
                     hover:bg-white/5 hover:border-white/20 text-sm font-medium transition-all duration-200"
        >
          Sign In Instead
        </Link>

        <p className="text-center text-slate-600 text-xs mt-6">
          By registering you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────
function getStrength(password) {
  let score = 0;
  if (password.length >= 6)  score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function getStrengthLabel(password) {
  const s = getStrength(password);
  return ["", "Weak", "Fair", "Good", "Strong"][s] || "";
}
