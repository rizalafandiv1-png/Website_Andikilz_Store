import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { User, LogOut, Clock, LogIn, ShoppingBag, ShieldCheck, HelpCircle, Instagram, Twitter, Github } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { motion } from "motion/react";
import SocialProof from "./SocialProof";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-50 selection:bg-violet-500/30 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="glass rounded-[2rem] px-8 h-20 flex items-center justify-between shadow-2xl shadow-black/50 border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform duration-500">
              <Logo className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight hidden sm:block">
              Andikilz <span className="text-violet-400">Store</span>
            </span>
          </Link>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide uppercase">
              <Link 
                to="/products" 
                className={`transition-all hover:text-violet-400 ${isActive('/products') ? 'text-violet-400' : 'text-zinc-400'}`}
              >
                Katalog
              </Link>
              <Link 
                to="/order-history" 
                className={`transition-all hover:text-violet-400 ${isActive('/order-history') ? 'text-violet-400' : 'text-zinc-400'}`}
              >
                Pesanan
              </Link>
            </div>

            <div className="h-8 w-px bg-white/10 hidden md:block" />
            
            {!loading && (
              user ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 pl-4 pr-2 py-1.5 rounded-2xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold shadow-lg shadow-violet-500/20">
                      {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-zinc-200 hidden lg:block max-w-[120px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <button 
                      onClick={handleLogout} 
                      className="p-2 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                      title="Keluar"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/login" 
                    className="text-sm font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    Masuk
                  </Link>
                  <Link 
                    to="/products" 
                    className="px-6 py-3 rounded-2xl bg-white text-black hover:bg-zinc-200 text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
                  >
                    Mulai
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      <SocialProof />

      {/* Footer */}
      <footer className="pt-24 pb-12 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-white/10">
                  <Logo className="w-6 h-6 text-zinc-400" />
                </div>
                <span className="font-bold text-2xl tracking-tight">Andikilz Store</span>
              </Link>
              <p className="text-zinc-500 text-lg font-light leading-relaxed max-w-md">
                Penyedia layanan premium terpercaya dengan sistem otomatis 24/7. Dapatkan akses ke alat digital terbaik dunia dengan harga terjangkau.
              </p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-white/10 hover:text-violet-400 transition-all">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-lg">Layanan</h4>
              <ul className="space-y-4 text-zinc-500">
                <li><Link to="/products" className="hover:text-white transition-colors">Semua Produk</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Langganan</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">Top Up</Link></li>
                <li><Link to="/order-history" className="hover:text-white transition-colors">Cek Pesanan</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-lg">Dukungan</h4>
              <ul className="space-y-4 text-zinc-500">
                <li><a href="#" className="hover:text-white transition-colors">Pusat Bantuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">Admin Panel</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-zinc-600 text-sm">
              © {new Date().getFullYear()} Andikilz Store. Crafted with passion for digital freedom.
            </p>
            <div className="flex items-center gap-8 text-zinc-600 text-sm font-medium">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Secure Payment</div>
              <div className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> 24/7 Support</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
