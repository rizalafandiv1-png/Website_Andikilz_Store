import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { 
  User, 
  LogOut, 
  Clock, 
  LogIn, 
  ShoppingBag, 
  ShieldCheck, 
  HelpCircle, 
  Instagram, 
  Twitter, 
  Github,
  Menu,
  X,
  MessageCircle,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { motion, AnimatePresence } from "motion/react";
import SocialProof from "./SocialProof";
import { useState, useEffect } from "react";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
      setIsMenuOpen(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-50 selection:bg-violet-500/30 font-sans flex flex-col">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-6 px-6 ${scrolled ? 'pt-4' : 'pt-6'}`}>
        <div className={`max-w-7xl mx-auto glass rounded-[2rem] px-8 h-20 flex items-center justify-between shadow-2xl transition-all duration-500 border-white/10 ${scrolled ? 'shadow-violet-500/5' : 'shadow-black/50'}`}>
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/20 group-hover:scale-110 transition-transform duration-500">
              <Logo className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight hidden sm:block">
              Andikilz <span className="text-violet-400">Store</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-8 text-[10px] font-black tracking-[0.2em] uppercase">
              <Link 
                to="/products" 
                className={`transition-all hover:text-violet-400 ${isActive('/products') ? 'text-violet-400' : 'text-zinc-500'}`}
              >
                Katalog
              </Link>
              <Link 
                to="/order-history" 
                className={`transition-all hover:text-violet-400 ${isActive('/order-history') ? 'text-violet-400' : 'text-zinc-500'}`}
              >
                Pesanan
              </Link>
            </div>

            <div className="h-8 w-px bg-white/10" />
            
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
                    className="text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                  >
                    Masuk
                  </Link>
                  <Link 
                    to="/products" 
                    className="px-6 py-3 rounded-2xl bg-white text-black hover:bg-zinc-200 text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/5"
                  >
                    Mulai Belanja
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden pt-32 px-6 bg-[#050505]/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4">
              <Link 
                to="/products" 
                onClick={() => setIsMenuOpen(false)}
                className={`p-6 rounded-3xl border flex items-center justify-between transition-all ${isActive('/products') ? 'bg-violet-500/10 border-violet-500/50 text-violet-400' : 'bg-white/5 border-white/10 text-zinc-400'}`}
              >
                <span className="text-xl font-black uppercase tracking-widest">Katalog Produk</span>
                <ShoppingBag className="w-6 h-6" />
              </Link>
              <Link 
                to="/order-history" 
                onClick={() => setIsMenuOpen(false)}
                className={`p-6 rounded-3xl border flex items-center justify-between transition-all ${isActive('/order-history') ? 'bg-violet-500/10 border-violet-500/50 text-violet-400' : 'bg-white/5 border-white/10 text-zinc-400'}`}
              >
                <span className="text-xl font-black uppercase tracking-widest">Riwayat Pesanan</span>
                <Clock className="w-6 h-6" />
              </Link>
              
              {!loading && (
                user ? (
                  <div className="mt-8 space-y-4">
                    <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-lg font-bold">
                        {user.displayName?.[0] || user.email?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white truncate">{user.displayName || user.email?.split('@')[0]}</div>
                        <div className="text-xs text-zinc-500 truncate">{user.email}</div>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="w-full p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black uppercase tracking-widest flex items-center justify-center gap-3"
                    >
                      <LogOut className="w-6 h-6" /> Keluar Akun
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <Link 
                      to="/login" 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-6 rounded-3xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-center"
                    >
                      Masuk
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={() => setIsMenuOpen(false)}
                      className="p-6 rounded-3xl bg-white text-black font-black uppercase tracking-widest text-center"
                    >
                      Daftar
                    </Link>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/6281234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
      >
        <MessageCircle className="w-8 h-8 fill-current" />
        <div className="absolute right-full mr-4 px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Butuh Bantuan? Chat Kami
        </div>
      </a>

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
