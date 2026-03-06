import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "../components/ui/Button";
import { LogIn, Mail, Lock, Chrome } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err: any) {
      setError("Email atau password salah.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Selamat Datang Kembali</h1>
          <p className="text-zinc-500 text-sm mt-2">Masuk ke akun Andikilz Store Anda</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                placeholder="nama@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-violet-500 hover:bg-violet-600 text-white py-6 rounded-xl font-bold">
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#0a0a0a] px-2 text-zinc-500">Atau masuk dengan</span>
          </div>
        </div>

        <Button 
          type="button" 
          onClick={handleGoogleLogin}
          variant="outline" 
          className="w-full border-white/10 hover:bg-white/5 py-6 rounded-xl font-medium"
        >
          <Chrome className="w-4 h-4 mr-2" />
          Google
        </Button>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Belum punya akun?{" "}
          <Link to="/register" className="text-violet-400 hover:text-violet-300 font-medium">
            Daftar Sekarang
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
