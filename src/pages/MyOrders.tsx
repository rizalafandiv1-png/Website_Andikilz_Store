import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Package, Clock, CheckCircle2, XCircle, RefreshCw, ArrowRight, Search } from "lucide-react";
import { Button } from "../components/ui/Button";

interface Order {
  id: string;
  product_name: string;
  category_name: string;
  price: number;
  status: string;
  date: string;
}

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) {
      fetch(`/api/orders/user/${user.uid}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-violet-500" /></div>;
  if (!user) return <Navigate to="/login" />;

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Selesai": return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "Proses": return <RefreshCw className="w-4 h-4 text-blue-400 animate-spin-slow" />;
      case "Menunggu": return <Clock className="w-4 h-4 text-amber-400" />;
      case "Dibatalkan": return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selesai": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "Proses": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Menunggu": return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "Dibatalkan": return "text-rose-400 bg-rose-400/10 border-rose-400/20";
      default: return "text-zinc-400 bg-zinc-400/10 border-zinc-400/20";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Riwayat Pesanan</h1>
        <p className="text-zinc-500">Pantau status semua pesanan Anda di sini.</p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input 
          type="text"
          placeholder="Cari ID Pesanan atau Produk..."
          className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-violet-500 mx-auto mb-4" />
          <p className="text-zinc-500">Memuat pesanan Anda...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-[#0a0a0a] border border-white/5 rounded-3xl">
          <Package className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Belum Ada Pesanan</h2>
          <p className="text-zinc-500 mb-8">Anda belum melakukan pembelian apapun.</p>
          <Link to="/products">
            <Button className="bg-violet-500 hover:bg-violet-600 text-white px-8">
              Mulai Belanja
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#0a0a0a] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">#{order.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white">{order.product_name}</h3>
                    <p className="text-xs text-zinc-500">{order.category_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:text-right gap-8">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Total Bayar</div>
                    <div className="font-bold text-white">Rp {order.price.toLocaleString('id-ID')}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Tanggal</div>
                    <div className="text-sm text-zinc-300">
                      {new Date(order.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                    </div>
                  </div>
                  <Link to={`/payment/${order.id}`} className="p-2 bg-white/5 rounded-xl hover:bg-violet-500/20 hover:text-violet-400 transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
