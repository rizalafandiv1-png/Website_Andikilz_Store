import { useState, useEffect } from "react";
import { User, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Button } from "../components/ui/Button";
import { Sparkles, LogOut, Send, Loader2, Crown } from "lucide-react";

interface UserData {
  is_pro: number;
  requests_count: number;
}

export default function Dashboard({ user }: { user: User }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState("");

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/user/${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
      }
    } catch (err) {
      console.error("Failed to fetch user data", err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user.uid]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, prompt })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setResponse(data.text);
      fetchUserData(); // Refresh usage count
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Failed to start checkout", err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="w-8 h-8 bg-zinc-50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-zinc-950" />
            </div>
            Nexus AI
          </div>
          
          <div className="flex items-center gap-4">
            {userData?.is_pro ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium border border-amber-500/20">
                <Crown className="w-4 h-4" />
                Pro Plan
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-400">
                  {3 - (userData?.requests_count || 0)} free generations left
                </span>
                <Button size="sm" variant="outline" onClick={handleUpgrade} className="gap-1.5">
                  <Crown className="w-4 h-4" />
                  Upgrade
                </Button>
              </div>
            )}
            
            <Button variant="ghost" size="icon" onClick={() => signOut(auth)}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-6 flex flex-col gap-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Output Area */}
        <div className="flex-1 rounded-3xl bg-zinc-900 border border-zinc-800 p-6 overflow-y-auto min-h-[400px]">
          {response ? (
            <div className="prose prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-zinc-300 leading-relaxed">{response}</div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
              <Sparkles className="w-12 h-12 opacity-20" />
              <p>What would you like to create today?</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Message Nexus AI..."
            className="w-full min-h-[120px] rounded-3xl border border-zinc-800 bg-zinc-900 p-4 pr-16 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-700 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <Button 
            size="icon" 
            className="absolute bottom-4 right-4 rounded-xl"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
        <p className="text-center text-xs text-zinc-500">
          Nexus AI can make mistakes. Consider verifying important information.
        </p>
      </main>
    </div>
  );
}
