import { useState, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-zinc-500">Memuat detail produk...</p>
      </div>
    );
  }

  if (!product) {
    return <Navigate to="/products" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-12">
        <Link to="/products" className="text-sm text-zinc-500 hover:text-white transition-colors mb-4 inline-block">
          &larr; Kembali ke Produk
        </Link>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Pilih paket {product.name} Anda</h1>
        <p className="text-xl text-zinc-400">Pilih opsi yang paling sesuai dengan kebutuhan Anda.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {product.categories.map((category, i) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Link 
              to={`/products/${product.id}/${category.id}`}
              className={`flex flex-col h-full p-8 rounded-3xl bg-[#0a0a0a] border hover:bg-zinc-900/50 transition-all group relative ${
                category.popular ? 'border-violet-500/30 shadow-2xl shadow-violet-500/10' : 'border-white/5 hover:border-violet-500/30'
              }`}
            >
              {category.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Paling Populer
                </div>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-violet-400 transition-colors translate-x-0 group-hover:translate-x-1" />
              </div>
              
              <p className="text-zinc-400 mb-6 h-12">{category.description}</p>
              
              <div className="mb-6 pb-6 border-b border-white/5">
                <span className="text-3xl font-bold">Rp {category.price.toLocaleString('id-ID')}</span>
              </div>
              
              <ul className="space-y-4 flex-1">
                {category.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
