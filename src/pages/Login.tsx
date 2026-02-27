import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, isFirebaseConfigured } from "../lib/firebase";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Sparkles, AlertCircle } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isFirebaseConfigured()) {
      setError("Firebase is not configured. Please add your credentials to the environment variables.");
      setLoading(false);
      return;
    }

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      // Sync user with backend
      await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: userCredential.user.uid, 
          email: userCredential.user.email 
        })
      });

      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 font-semibold text-xl tracking-tight mb-8">
        <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-zinc-950" />
        </div>
        Nexus AI
      </Link>

      <div className="w-full max-w-md p-8 rounded-3xl bg-zinc-900 border border-zinc-800">
        <h2 className="text-2xl font-semibold mb-2">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-zinc-400 mb-8">
          {isLogin ? "Enter your details to sign in." : "Sign up to start generating."}
        </p>

        {!isFirebaseConfigured() && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Firebase is not configured. Authentication will not work until you add your Firebase credentials to the environment variables.</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email</label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-zinc-50 hover:underline font-medium"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
