import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { productsConfig } from "../lib/products";
import { MonitorPlay, Palette, Bot, ArrowRight } from "lucide-react";

// Helper to map icon names to components
const getIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case "MonitorPlay": return <MonitorPlay className={className} />;
    case "Palette": return <Palette className={className} />;
    case "Bot": return <Bot className={className} />;
    default: return <MonitorPlay className={className} />;
  }
};

export default function Products() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Available Products</h1>
        <p className="text-xl text-zinc-400">Select a service to configure your subscription.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {productsConfig.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link 
              to={`/products/${product.id}`}
              className="block h-full p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 hover:border-violet-500/30 hover:bg-zinc-900/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                <ArrowRight className="w-6 h-6 text-violet-400" />
              </div>
              
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6">
                {getIcon(product.icon, "w-6 h-6 text-zinc-300 group-hover:text-violet-400 transition-colors")}
              </div>
              
              <h2 className="text-2xl font-bold mb-3">{product.name}</h2>
              <p className="text-zinc-400 leading-relaxed mb-6">{product.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {product.categories.map(cat => (
                  <span key={cat.id} className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-zinc-300">
                    {cat.name}
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
