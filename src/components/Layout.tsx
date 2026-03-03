import { Link, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { User, LogOut, Clock } from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-50 selection:bg-violet-500/30 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl tracking-tight hover:opacity-80 transition-opacity">
            <Logo />
            Andikilz <span className="text-zinc-500">Store</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/products" className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Produk
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/order-history" className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Riwayat
                </Link>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/5">
                  <User className="w-4 h-4 text-violet-400" />
                  <span className="text-zinc-300">{user.name}</span>
                  <button onClick={handleLogout} className="ml-2 p-1 hover:text-rose-400 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-zinc-400 hover:text-white transition-colors">
                  Masuk
                </Link>
                <Link to="/products" className="px-5 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors">
                  Mulai
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-zinc-500 text-sm bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-semibold text-zinc-300">
            <Logo className="w-5 h-5 grayscale opacity-50" />
            Andikilz Store
          </div>
          <p>© {new Date().getFullYear()} Andikilz Store. Hak cipta dilindungi undang-undang.</p>
          <div className="flex gap-6">
            <Link to="/admin" className="hover:text-zinc-300 transition-colors">Admin</Link>
            <a href="#" className="hover:text-zinc-300 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Privasi</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Bantuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
