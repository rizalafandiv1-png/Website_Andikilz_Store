import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  MonitorPlay, 
  Palette, 
  Bot, 
  ArrowRight, 
  Gamepad2, 
  Flame, 
  Package,
  Smartphone,
  Tv,
  Music,
  ShieldCheck,
  Search,
  Filter,
  X,
  Zap,
  Star,
  ChevronRight,
  ShoppingCart
} from "lucide-react";

import { Skeleton } from "../components/ui/Skeleton";

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

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType ? product.type === selectedType : true;
      return matchesSearch && matchesType;
    });
  }, [products, searchQuery, selectedType]);

  const productTypes = useMemo(() => {
    const types = new Set(products.map(p => p.type));
    return Array.from(types);
  }, [products]);

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Header */}
        <div className="relative mb-16 p-12 rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-900/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-[10px] font-bold tracking-widest uppercase text-violet-400 mb-6">
                <Zap className="w-3 h-3 fill-current" /> Pengiriman Instan 24/7
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                Katalog <span className="text-gradient">Layanan.</span>
              </h1>
              <p className="text-lg text-zinc-400 font-light leading-relaxed">
                Pilih layanan premium favorit Anda. Semua transaksi aman, bergaransi, dan diproses secara otomatis oleh sistem kami.
              </p>
            </div>
            
            <div className="w-full md:w-80 space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                <input 
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-violet-500/50 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all text-sm"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs text-zinc-500">
                <Filter className="w-4 h-4" />
                <span>{filteredProducts.length} Produk ditemukan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {loading ? (
            [1, 2, 3].map(i => <Skeleton key={i} className="w-32 h-12 rounded-2xl" />)
          ) : (
            <>
              <button
                onClick={() => setSelectedType(null)}
                className={`flex-none px-8 py-3.5 rounded-2xl text-sm font-bold transition-all border ${
                  selectedType === null 
                    ? "bg-white text-black border-white shadow-xl shadow-white/10" 
                    : "bg-white/5 text-zinc-400 hover:bg-white/10 border-white/5"
                }`}
              >
                Semua Layanan
              </button>
              {productTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`flex-none px-8 py-3.5 rounded-2xl text-sm font-bold capitalize transition-all border ${
                    selectedType === type 
                      ? "bg-violet-600 text-white border-violet-500 shadow-xl shadow-violet-600/20" 
                      : "bg-white/5 text-zinc-400 hover:bg-white/10 border-white/5"
                  }`}
                >
                  {type}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="p-6 rounded-[2.5rem] bg-white/5 border border-white/5 h-[320px] space-y-6">
                <Skeleton className="w-16 h-16 rounded-2xl" />
                <Skeleton className="w-3/4 h-8 rounded-lg" />
                <Skeleton className="w-full h-12 rounded-lg" />
                <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                  <div className="space-y-2">
                    <Skeleton className="w-16 h-4 rounded" />
                    <Skeleton className="w-24 h-6 rounded" />
                  </div>
                  <Skeleton className="w-10 h-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => {
                const minPrice = Math.min(...product.categories.map((c: any) => c.price));
                const hasPopular = product.categories.some((c: any) => c.popular);
                
                return (
                  <motion.div
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Link 
                      to={`/products/${product.id}`}
                      className="group block h-full p-6 rounded-[2.5rem] glass border-white/5 hover:border-violet-500/30 hover:bg-zinc-900/40 transition-all relative overflow-hidden flex flex-col"
                    >
                      {/* Popular Badge */}
                      {hasPopular && (
                        <div className="absolute top-6 right-6 z-20">
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-tighter text-amber-500">
                            <Star className="w-3 h-3 fill-current" /> Popular
                          </div>
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="relative z-10 flex-1">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-violet-500/20 transition-all duration-500">
                          {getIcon(product.icon, "w-8 h-8 text-zinc-400 group-hover:text-violet-400 transition-colors")}
                        </div>
                        
                        <h2 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{product.name}</h2>
                        <p className="text-zinc-500 leading-relaxed mb-6 line-clamp-2 text-xs font-medium">
                          {product.description}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="relative z-10 pt-6 border-t border-white/5 mt-auto">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 mb-1">Mulai Dari</p>
                            <p className="text-xl font-black text-white group-hover:text-violet-400 transition-colors">
                              {formatPrice(minPrice)}
                            </p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-violet-600 transition-all duration-500">
                            <ShoppingCart className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Hover Glow Effect */}
                      <div className="absolute -inset-px bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center glass rounded-[3rem] border-dashed border-white/10"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Produk Tidak Ditemukan</h3>
            <p className="text-zinc-500">Coba kata kunci lain atau hapus filter.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedType(null); }}
              className="mt-8 px-8 py-3 rounded-2xl bg-white/5 text-violet-400 font-bold hover:bg-white/10 transition-all"
            >
              Reset Pencarian
            </button>
          </motion.div>
        )}

        {/* Trust Footer */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: ShieldCheck, title: "Transaksi Aman", desc: "Enkripsi SSL & Gateway Pembayaran Terpercaya" },
            { icon: Zap, title: "Proses Otomatis", desc: "Pesanan diproses instan oleh sistem kami" },
            { icon: Star, title: "Layanan Terbaik", desc: "Kualitas premium dengan harga kompetitif" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6 p-8 rounded-[2rem] bg-white/5 border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <item.icon className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-zinc-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
