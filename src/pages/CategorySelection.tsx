import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowRight, 
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
  ShoppingCart
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

export default function CategorySelection() {
  const { productId } = useParams();
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-zinc-500 font-medium tracking-widest uppercase text-xs">Memuat Detail...</p>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/products" />;
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 mb-12">
          <Link to="/products" className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Katalog
          </Link>
          <div className="w-1 h-1 rounded-full bg-zinc-800" />
          <span className="text-sm font-bold text-zinc-300 capitalize">{product.name}</span>
        </div>

        {/* Product Header */}
        <div className="relative mb-16 p-12 rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-900/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="w-32 h-32 rounded-[2rem] bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl shadow-black/50">
              {getIcon(product.icon, "w-16 h-16 text-violet-400")}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold tracking-widest uppercase text-violet-400 mb-6">
                <Zap className="w-3 h-3 fill-current" /> Paling Laris Minggu Ini
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Pilih Paket <span className="text-gradient">{product.name}.</span>
              </h1>
              <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-2xl">
                {product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {product.categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link 
                to={`/products/${product.id}/${category.id}`}
                className={`group flex flex-col h-full p-10 rounded-[3rem] glass border-white/5 hover:border-violet-500/30 hover:bg-zinc-900/40 transition-all relative overflow-hidden ${
                  category.popular ? 'border-violet-500/30 shadow-2xl shadow-violet-500/10' : ''
                }`}
              >
                {/* Popular Badge */}
                {category.popular && (
                  <div className="absolute top-8 right-8 z-20">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-tighter text-amber-500">
                      <Star className="w-3 h-3 fill-current" /> Best Value
                    </div>
                  </div>
                )}

                <div className="relative z-10 flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold group-hover:text-white transition-colors">{category.name}</h2>
                    <div className="p-2 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <ArrowRight className="w-6 h-6 text-violet-400" />
                    </div>
                  </div>
                  
                  <p className="text-zinc-400 mb-10 text-lg font-light leading-relaxed">{category.description}</p>
                  
                  <div className="mb-10 pb-10 border-b border-white/5">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-2">Harga Paket</p>
                    <span className="text-4xl font-black text-white group-hover:text-violet-400 transition-colors">
                      {formatPrice(category.price)}
                    </span>
                  </div>
                  
                  <ul className="space-y-5 mb-10">
                    {category.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-4">
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-emerald-400" />
                        </div>
                        <span className="text-zinc-400 text-sm font-medium group-hover:text-zinc-200 transition-colors">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative z-10">
                  <div className="w-full py-5 rounded-2xl bg-white text-black font-black text-center group-hover:bg-violet-600 group-hover:text-white transition-all duration-500 flex items-center justify-center gap-3">
                    <ShoppingCart className="w-5 h-5" />
                    Pesan Sekarang
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute -inset-px bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-24 p-12 rounded-[3rem] glass border-white/5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-fuchsia-600/5" />
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-4">Butuh Bantuan Memilih?</h3>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto font-light">
              Tim support kami siap membantu Anda memilih paket yang paling sesuai dengan kebutuhan Anda. Hubungi kami kapan saja.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-violet-400" /> Hubungi Support
              </a>
              <a href="#" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold flex items-center gap-2">
                <Package className="w-5 h-5 text-fuchsia-400" /> Panduan Pembelian
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
