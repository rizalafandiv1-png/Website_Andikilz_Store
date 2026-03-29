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
  X
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-zinc-500 font-medium tracking-widest uppercase text-xs">Memuat Katalog...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">Katalog Produk</h1>
            <p className="text-xl text-zinc-400 font-light leading-relaxed">
              Temukan berbagai layanan premium dengan harga terbaik. Semua akun bergaransi dan dikirim secara instan.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
              <input 
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-violet-500/50 focus:outline-none focus:ring-4 focus:ring-violet-500/10 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              selectedType === null 
                ? "bg-white text-black shadow-xl shadow-white/10" 
                : "bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/5"
            }`}
          >
            Semua
          </button>
          {productTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all ${
                selectedType === type 
                  ? "bg-violet-600 text-white shadow-xl shadow-violet-600/20" 
                  : "bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/5"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, i) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link 
                    to={`/products/${product.id}`}
                    className="group block h-full p-8 rounded-[2rem] glass border-white/5 hover:border-violet-500/30 hover:bg-zinc-900/40 transition-all relative overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute -inset-px bg-gradient-to-br from-violet-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-violet-500/20 transition-all duration-500">
                          {getIcon(product.icon, "w-8 h-8 text-zinc-400 group-hover:text-violet-400 transition-colors")}
                        </div>
                        <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                          <ArrowRight className="w-5 h-5 text-violet-400" />
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">{product.name}</h2>
                      <p className="text-zinc-400 leading-relaxed mb-8 line-clamp-2 text-sm font-light">
                        {product.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                        {product.categories.slice(0, 3).map(cat => (
                          <span key={cat.id} className="px-3 py-1 rounded-lg bg-white/5 text-[10px] uppercase tracking-wider font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors">
                            {cat.name}
                          </span>
                        ))}
                        {product.categories.length > 3 && (
                          <span className="px-3 py-1 rounded-lg bg-white/5 text-[10px] uppercase tracking-wider font-bold text-zinc-500">
                            +{product.categories.length - 3} More
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
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
              className="mt-8 text-violet-400 font-bold hover:underline"
            >
              Reset Pencarian
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
