import { useState, useEffect } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { MessageCircle, AlertCircle, ArrowLeft, RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function QrisPayment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data);
        if (data.status === "Selesai") {
          navigate("/success", { state: { order: data } });
        }
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
    
    // Auto refresh status every 10 seconds
    const interval = setInterval(() => {
      if (order?.status === "Menunggu") {
        fetchOrder();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orderId, order?.status]);

  if (loading || authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <RefreshCw className="animate-spin w-8 h-8 text-violet-500 mx-auto mb-4" />
        <p className="text-zinc-500">Memeriksa status pesanan...</p>
      </div>
    );
  }

  if (!order) {
    return <Navigate to="/products" />;
  }

  const handleReopenSnap = async () => {
    setCheckingStatus(true);
    try {
      const paymentResponse = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.price,
          customerDetails: {
            first_name: user?.displayName || user?.email?.split('@')[0],
            email: user?.email,
          },
          itemDetails: [{
            id: order.id,
            price: order.price,
            quantity: 1,
            name: `${order.product_name} - ${order.category_name}`
          }]
        }),
      });

      const paymentData = await paymentResponse.json();
      
      if (paymentData.token) {
        // @ts-ignore
        window.snap.pay(paymentData.token, {
          onSuccess: () => navigate("/success"),
          onPending: () => fetchOrder(),
          onError: () => alert("Pembayaran gagal."),
          onClose: () => fetchOrder()
        });
      }
    } catch (error) {
      console.error("Failed to reopen snap:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const getStatusIcon = () => {
    switch (order.status) {
      case "Selesai": return <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />;
      case "Dibatalkan": return <XCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />;
      default: return <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case "Selesai": return "Pembayaran Berhasil";
      case "Dibatalkan": return "Pesanan Dibatalkan";
      default: return "Menunggu Pembayaran";
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <div className="mb-8">
        <Link to="/order-history" className="text-sm text-zinc-500 hover:text-white transition-colors mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Riwayat
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 md:p-10 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl text-center"
      >
        {getStatusIcon()}
        <h1 className="text-2xl font-bold tracking-tight mb-2">{getStatusText()}</h1>
        <p className="text-zinc-400 mb-8">ID Pesanan: <span className="text-white font-mono">{order.id}</span></p>

        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 mb-8 text-left space-y-4">
          <div className="flex justify-between">
            <span className="text-zinc-500">Produk</span>
            <span className="font-medium">{order.product_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Kategori</span>
            <span className="font-medium">{order.category_name}</span>
          </div>
          <div className="flex justify-between border-t border-white/5 pt-4">
            <span className="text-zinc-500">Total Tagihan</span>
            <span className="font-bold text-lg text-white">Rp {order.price.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {order.status === "Menunggu" && (
          <div className="space-y-4">
            <Button 
              onClick={handleReopenSnap}
              disabled={checkingStatus}
              className="w-full rounded-xl h-14 bg-white text-black hover:bg-zinc-200 font-bold"
            >
              {checkingStatus ? <RefreshCw className="w-5 h-5 animate-spin" /> : "Bayar Sekarang"}
            </Button>
            
            <p className="text-xs text-zinc-500">
              Halaman ini akan otomatis diperbarui setelah pembayaran Anda terverifikasi.
            </p>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4">
          <Button 
            asChild
            variant="outline"
            className="flex-1 rounded-xl h-14 border-white/10 hover:bg-white/5 text-white"
          >
            <a href={`https://wa.me/6282258655296?text=Halo,%20saya%20ingin%20bertanya%20tentang%20pesanan%20${order.id}.`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Bantuan WhatsApp
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
