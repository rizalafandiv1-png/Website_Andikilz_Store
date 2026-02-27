import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { productsConfig } from "../lib/products";
import { Button } from "../components/ui/Button";
import { Lock, Check } from "lucide-react";

export default function CategoryDetail() {
  const { productId, categoryId } = useParams();
  
  const product = productsConfig.find(p => p.id === productId);
  const category = product?.categories.find(c => c.id === categoryId);

  if (!product || !category) {
    return <Navigate to="/products" />;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="mb-8">
        <Link to={`/products/${product.id}`} className="text-sm text-zinc-500 hover:text-white transition-colors mb-4 inline-block">
          &larr; Back to {product.name} Options
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative p-8 md:p-12 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl shadow-violet-500/5"
      >
        {category.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-violet-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
            Most Popular
          </div>
        )}
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{category.name}</h1>
          <p className="text-lg text-zinc-400">{category.description}</p>
        </div>
        
        <div className="text-center mb-10 pb-10 border-b border-white/5">
          <span className="text-6xl font-bold">${category.price}</span>
          <span className="text-zinc-500 ml-2">USD</span>
        </div>
        
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-6">What's included:</h3>
          <ul className="space-y-4">
            {category.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-emerald-400 shrink-0" />
                <span className="text-zinc-300 text-lg">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <Button 
          asChild 
          size="lg" 
          className="w-full rounded-xl h-16 text-lg font-medium bg-white text-black hover:bg-zinc-200"
        >
          <Link 
            to={`/checkout/${product.id}/${category.id}`}
            className="flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5 opacity-70" />
            Buy Now
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
