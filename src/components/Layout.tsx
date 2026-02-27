import { Link, Outlet } from "react-router-dom";
import { Logo } from "./Logo";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-50 selection:bg-violet-500/30 font-sans flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold text-xl tracking-tight hover:opacity-80 transition-opacity">
            <Logo />
            Aura<span className="text-zinc-500">Pass</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/products" className="text-zinc-400 hover:text-white transition-colors">
              Products
            </Link>
            <Link to="/products" className="px-5 py-2 rounded-full bg-white text-black hover:bg-zinc-200 transition-colors">
              Get Access
            </Link>
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
            AuraPass
          </div>
          <p>© {new Date().getFullYear()} AuraPass. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
