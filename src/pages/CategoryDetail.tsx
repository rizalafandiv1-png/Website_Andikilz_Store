import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { 
  Lock, 
  Check, 
  ChevronLeft, 
  Star, 
  Zap, 
  ShieldCheck, 
  MonitorPlay, 
  Palette, 
  Bot, 
  Gamepad2, 
  Flame, 
  Package,
  Smartphone,
  Tv,
  Music,
  ShoppingCart,
  ArrowRight
} from "lucide-react";

// Helper to map icon names to components
const getIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case "MonitorPlay": return <MonitorPlay className={className} />;
    case "Palette": return <Palette className={className} />;
    case "Bot": return <Bot className={className} />;
    case "Gamepad2": return <Gamepad2 className={className} />;
    case "Flame": return <Flame className={className} />;
    case "Smartphone": return <Smartphone className={className} />;
    case "Tv": return <Tv className={className} />;
    case "Music": return <Music className={className} />;
    case "ShieldCheck": return <ShieldCheck className={className} />;
    default: return <Package className={className} />;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function CategoryDetail() {
  const { productId, categoryId } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        const found = data.find((p: any) => p.id === productId);
        setProduct(found);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const category = product?.categories.find((c: any) => c.id === categoryId);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-zinc-500 font-medium tracking-widest uppercase text-xs">Memuat Paket...</p>
      </div>
    );
  }

  if (!product || !category) {
    return <Navigate to="/products" />;
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 mb-12">
          <Link to={`/products/${product.id}`} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Pilihan Paket
          </Link>
          <div className="w-1 h-1 rounded-full bg-zinc-800" />
          <span className="text-sm font-bold text-zinc-300 capitalize">{category.name}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative p-10 md:p-16 rounded-[3rem] glass border-white/10 shadow-2xl shadow-violet-500/10 overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          {category.popular && (
            <div className="absolute top-8 right-8 z-20">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-tighter text-amber-500">
                <Star className="w-3 h-3 fill-current" /> Paling Populer
              </div>
            </div>
          )}
          
          <div className="relative z-10 text-center mb-12">
            <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/50">
              {getIcon(product.icon, "w-10 h-10 text-violet-400")}
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight">{category.name}</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-xl mx-auto">{category.description}</p>
          </div>
          
          <div className="relative z-10 text-center mb-12 pb-12 border-b border-white/5">
            <p className="text-xs uppercase tracking-[0.2em] font-black text-zinc-500 mb-4">Total Pembayaran</p>
            <span className="text-6xl font-black text-white">{formatPrice(category.price)}</span>
          </div>
          
          <div className="relative z-10 mb-12">
            <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-violet-400" />
              Fitur & Keuntungan:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {category.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="mt-1 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-zinc-300 text-sm font-medium leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative z-10">
            <Button 
              asChild 
              size="lg" 
              className="w-full rounded-2xl h-20 text-xl font-black bg-white text-black hover:bg-zinc-200 shadow-2xl shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link 
                to={`/checkout/${product.id}/${category.id}`}
                className="flex items-center justify-center gap-4"
              >
                Lanjut ke Pembayaran
                <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>
            <p className="mt-6 text-center text-xs text-zinc-500 font-medium flex items-center justify-center gap-2">
              <Lock className="w-3 h-3" /> Transaksi Aman & Terenkripsi
            </p>
          </div>
        </motion.div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-8 rounded-[2.5rem] glass border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Aktivasi Instan</h4>
              <p className="text-xs text-zinc-500">Detail akun dikirim langsung setelah bayar.</p>
            </div>
          </div>
          <div className="p-8 rounded-[2.5rem] glass border-white/5 flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Garansi Penuh</h4>
              <p className="text-xs text-zinc-500">Perlindungan selama masa aktif paket.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
