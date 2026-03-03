import { useState, useEffect } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { QrCode, CreditCard } from "lucide-react";

export default function Checkout() {
  const { productId, categoryId } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
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
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-zinc-500">Menyiapkan checkout...</p>
      </div>
    );
  }

  if (!product || !category) {
    return <Navigate to="/products" />;
  }

  const handleContinue = () => {
    if (selectedMethod === "qris") {
      const searchParams = new URLSearchParams(window.location.search);
      navigate(`/payment/qris/${product.id}/${category.id}?${searchParams.toString()}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-8">
        <Link to={`/products/${product.id}/${category.id}`} className="text-sm text-zinc-500 hover:text-white transition-colors mb-4 inline-block">
          &larr; Kembali ke {category.name}
        </Link>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Checkout</h1>
        <p className="text-zinc-400">Pilih metode pembayaran yang Anda inginkan.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 space-y-6">
          <h2 className="text-xl font-semibold mb-4">Metode Pembayaran</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => setSelectedMethod("qris")}
              className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                selectedMethod === "qris" 
                  ? "bg-violet-500/10 border-violet-500/50" 
                  : "bg-[#0a0a0a] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${selectedMethod === "qris" ? "bg-violet-500/20 text-violet-400" : "bg-zinc-900 text-zinc-400"}`}>
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-lg">QRIS</div>
                  <div className="text-sm text-zinc-500">Pembayaran instan via E-Wallet/Bank</div>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedMethod === "qris" ? "border-violet-500" : "border-zinc-700"
              }`}>
                {selectedMethod === "qris" && <div className="w-3 h-3 rounded-full bg-violet-500" />}
              </div>
            </button>

            <button
              disabled
              className="w-full flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-[#0a0a0a] opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-zinc-900 text-zinc-500">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-zinc-400">Kartu Kredit (Stripe)</div>
                  <div className="text-sm text-zinc-600">Segera hadir</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-[#0a0a0a] border border-white/5 sticky top-24">
            <h2 className="text-lg font-semibold mb-6">Ringkasan Pesanan</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-zinc-200">{product.name}</div>
                  <div className="text-sm text-zinc-500">{category.name}</div>
                </div>
                <span className="font-medium">Rp {category.price.toLocaleString('id-ID')}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5 flex justify-between items-center mb-8">
              <span className="font-semibold text-zinc-400">Total</span>
              <span className="text-2xl font-bold text-white">Rp {category.price.toLocaleString('id-ID')}</span>
            </div>

            <Button 
              onClick={handleContinue}
              disabled={!selectedMethod}
              size="lg" 
              className="w-full rounded-xl h-14 text-base font-medium bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              Lanjutkan ke Pembayaran
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
