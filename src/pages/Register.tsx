import React, { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "../components/ui/Button";
import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      navigate("/");
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Email sudah terdaftar.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password minimal 6 karakter.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
      console.error(err);
    } finally {
      setLoading(false);
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
            <UserPlus className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Buat Akun Baru</h1>
          <p className="text-zinc-500 text-sm mt-2">Bergabung dengan komunitas Andikilz Store</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                placeholder="Andi Kilz"
              />
            </div>
          </div>
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
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-violet-500 hover:bg-violet-600 text-white py-6 rounded-xl font-bold">
            {loading ? "Memproses..." : "Daftar Akun"}
          </Button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-8">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium">
            Masuk Sekarang
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
