import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { productsConfig } from "../lib/products";
import { Button } from "../components/ui/Button";
import { MessageCircle, AlertCircle, ArrowLeft } from "lucide-react";

export default function QrisPayment() {
  const { productId, categoryId } = useParams();
  const navigate = useNavigate();
  
  const product = productsConfig.find(p => p.id === productId);
  const category = product?.categories.find(c => c.id === categoryId);

  if (!product || !category) {
    return <Navigate to="/products" />;
  }

  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get("userId");
  const zoneId = searchParams.get("zoneId");

  const priceFormatted = category.price.toLocaleString('id-ID');

  const handleConfirm = () => {
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
      productName: product.name,
      categoryName: category.name,
      price: category.price,
      date: new Date().toISOString(),
      status: "Menunggu"
    };
    
    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]));

    // Navigate to success page after a short delay to allow the WA link to open
    setTimeout(() => {
      navigate("/success", { state: { order: newOrder } });
    }, 100);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <div className="mb-8">
        <Link to={`/checkout/${product.id}/${category.id}${window.location.search}`} className="text-sm text-zinc-500 hover:text-white transition-colors mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Checkout
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 md:p-10 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Pembayaran QRIS</h1>
          <p className="text-zinc-400">Scan kode QR di bawah menggunakan aplikasi E-Wallet atau Mobile Banking pilihan Anda.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl mb-8 max-w-sm mx-auto flex flex-col items-center justify-center shadow-inner">
          {/* QRIS Image from Google Drive */}
          <img 
            src="https://lh3.googleusercontent.com/d/1hlB7tOP8uZydM8LBiYNNZfX8LTQ8hcJp" 
            alt="Kode Pembayaran QRIS" 
            className="w-full h-auto rounded-xl"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Fallback if image fails to load
              e.currentTarget.src = "https://placehold.co/400x600/white/black?text=QRIS+Andikilz+Store\\nSilakan+hubungi+admin";
            }}
          />
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center p-5 rounded-2xl bg-zinc-900/50 border border-white/5">
            <span className="text-zinc-400 font-medium">Total Tagihan</span>
            <div className="text-right">
              <div className="font-bold text-xl text-white">Rp {priceFormatted}</div>
            </div>
          </div>
          
          {(userId || zoneId) && (
            <div className="flex justify-between items-center p-5 rounded-2xl bg-zinc-900/50 border border-white/5">
              <span className="text-zinc-400 font-medium">Target ID</span>
              <span className="font-bold text-white">
                {userId}{zoneId ? ` (${zoneId})` : ""}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center p-5 rounded-2xl bg-zinc-900/50 border border-white/5">
            <span className="text-zinc-400 font-medium">ID Pesanan</span>
            <span className="font-mono text-sm text-white bg-zinc-800 px-3 py-1 rounded-lg">
              ORD-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-medium text-sm text-zinc-300 uppercase tracking-wider">Instruksi Pembayaran:</h3>
          <ol className="text-sm text-zinc-400 space-y-3 list-decimal list-inside bg-zinc-900/30 p-5 rounded-2xl border border-white/5">
            <li>Buka aplikasi E-Wallet (OVO, GoPay, Dana) atau Mobile Banking Anda.</li>
            <li>Pilih opsi <strong>Scan QR</strong>.</li>
            <li>Scan kode QRIS di atas.</li>
            <li>Verifikasi jumlah dan nama merchant (<strong>Andikilz Store</strong>).</li>
            <li>Selesaikan pembayaran.</li>
          </ol>
        </div>

        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex gap-3 mb-8">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">Setelah menyelesaikan pembayaran, harap konfirmasi melalui WhatsApp dengan bukti pembayaran untuk menerima detail akun Anda.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            asChild
            onClick={handleConfirm}
            className="flex-1 rounded-xl h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-base font-medium"
          >
            <a href={`https://wa.me/6282258655296?text=Halo,%20saya%20telah%20melakukan%20pembayaran%20untuk%20${product.name}%20-%20${category.name}${userId ? `%20(ID:%20${userId}${zoneId ? `%20Zone:%20${zoneId}` : ""})` : ""}.`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Konfirmasi via WhatsApp
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
