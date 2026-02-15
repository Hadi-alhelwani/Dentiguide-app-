"use client";
import { useState } from "react";
import { createClient } from "../../lib/supabase-browser";
export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); const [message, setMessage] = useState("");
  const supabase = createClient();
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError(""); setMessage("");
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message); else window.location.href = "/dashboard";
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` } });
      if (error) setError(error.message); else setMessage("Check your email for a confirmation link.");
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white text-2xl font-bold mb-4">D</div>
          <h1 className="text-2xl font-bold text-white">Dentiguide</h1>
          <p className="text-slate-400 text-sm mt-1">MDR Documentation System</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-5">{mode === "login" ? "Sign in" : "Create account"}</h2>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}
          <div className="mb-4"><label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" /></div>
          <div className="mb-6"><label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" /></div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition">
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}</button>
          <p className="mt-4 text-center text-sm text-gray-500">
            {mode === "login" ? "No account yet? " : "Already have an account? "}
            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-blue-600 font-medium hover:underline">
              {mode === "login" ? "Sign up" : "Sign in"}</button></p>
        </form>
      </div>
    </div>
  );
}
