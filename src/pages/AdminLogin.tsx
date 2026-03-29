import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Test health check first
      try {
        const healthCheck = await fetch("/api/health");
        if (!healthCheck.ok) {
          console.warn("Health check failed");
          // Don't set error yet, let login attempt proceed
        }
      } catch (hErr) {
        console.error("Health check network error:", hErr);
        setError("Koneksi ke server gagal (Health Check)");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      console.log("Login response status:", response.status);
      
      let data;
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch (jsonErr) {
        console.error("Failed to parse JSON response:", responseText);
        throw new Error("Server returned non-JSON response");
      }

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin");
      } else {
        setError(data.error || "Login gagal");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message === "Server returned non-JSON response" 
        ? "Kesalahan server (500)" 
        : "Terjadi kesalahan koneksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-zinc-500 text-sm mt-2">Masukkan password untuk mengakses dashboard admin.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 ml-1">
              Admin Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl h-12 bg-white text-black hover:bg-zinc-200 font-bold"
          >
            {loading ? "Memproses..." : (
              <span className="flex items-center justify-center gap-2">
                Masuk Dashboard <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
