import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

interface Order {
  id: string;
  productName: string;
  categoryName: string;
  price: number;
  date: string;
  status: "Selesai" | "Menunggu" | "Dibatalkan";
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    // Mock orders from localStorage
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders);
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <div className="mb-12">
        <Link to="/" className="text-sm text-zinc-500 hover:text-white transition-colors mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
        </Link>
        <h1 className="text-4xl font-bold tracking-tight mt-4">Riwayat Pesanan</h1>
        <p className="text-xl text-zinc-400 mt-2">Lihat semua pesanan Anda di Andikilz Store.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 rounded-3xl bg-[#0a0a0a] border border-white/5">
          <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-300">Belum ada pesanan</h2>
          <p className="text-zinc-500 mt-2 mb-8">Anda belum melakukan pembelian apa pun.</p>
          <Link to="/products" className="text-violet-400 hover:text-violet-300 font-medium">
            Mulai Belanja Sekarang &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{order.productName}</h3>
                  <p className="text-sm text-zinc-500">{order.categoryName} • {new Date(order.date).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-8">
                <div className="text-right">
                  <div className="font-bold text-white">Rp {order.price.toLocaleString('id-ID')}</div>
                  <div className="text-xs text-zinc-500">ID: {order.id}</div>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === "Selesai" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                  order.status === "Menunggu" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                  "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}>
                  {order.status === "Selesai" && <CheckCircle2 className="w-3 h-3" />}
                  {order.status === "Dibatalkan" && <XCircle className="w-3 h-3" />}
                  {order.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
