import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Package, Clock, CheckCircle2, XCircle, RefreshCw, ArrowRight, Search, ShoppingBag, Calendar, CreditCard } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";

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

  if (authLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Selesai": return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "Proses": return <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />;
      case "Menunggu": return <Clock className="w-3.5 h-3.5" />;
      case "Dibatalkan": return <XCircle className="w-3.5 h-3.5" />;
      default: return <Clock className="w-3.5 h-3.5" />;
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
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest">
              <ShoppingBag className="w-3 h-3" /> Dashboard Pembeli
            </div>
            <h1 className="text-5xl font-black tracking-tight text-white">Riwayat Pesanan</h1>
            <p className="text-zinc-500 font-light text-lg max-w-md">
              Kelola dan pantau semua transaksi layanan digital Anda dalam satu tempat.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
            <input 
              type="text"
              placeholder="Cari ID Pesanan..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder:text-zinc-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-8 rounded-[2.5rem] glass border-white/5 flex flex-col md:flex-row gap-8 items-center">
                <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-3 w-full">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex gap-8 w-full md:w-auto">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center glass border-white/5 rounded-[3rem] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-zinc-900 border border-white/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                <Package className="w-10 h-10 text-zinc-700" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4">Belum Ada Pesanan</h2>
              <p className="text-zinc-500 mb-10 max-w-sm mx-auto font-light">
                Sepertinya Anda belum melakukan pembelian apapun. Mulai belanja sekarang untuk melihat riwayat pesanan Anda.
              </p>
              <Link to="/products">
                <Button className="bg-white text-black hover:bg-zinc-200 px-12 h-14 rounded-2xl font-black text-lg shadow-2xl shadow-white/5">
                  Mulai Belanja
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order, idx) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-px bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                <div className="relative p-8 rounded-[2.5rem] glass border-white/5 group-hover:border-white/10 transition-all flex flex-col md:flex-row gap-8 items-center">
                  {/* Product Icon */}
                  <div className="w-16 h-16 bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                    <Package className="w-8 h-8 text-violet-400" />
                  </div>

                  {/* Order Info */}
                  <div className="flex-1 text-center md:text-left space-y-1">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                      <span className="font-mono text-[10px] text-zinc-500 font-bold tracking-tighter uppercase">ID: #{order.id}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-white group-hover:text-violet-400 transition-colors">{order.product_name}</h3>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{order.category_name}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-12 w-full md:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-center md:text-right">
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 flex items-center gap-2 justify-center md:justify-end">
                        <CreditCard className="w-3 h-3" /> Total
                      </div>
                      <div className="font-black text-white text-lg">Rp {order.price.toLocaleString('id-ID')}</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center md:text-right">
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1 flex items-center gap-2 justify-center md:justify-end">
                        <Calendar className="w-3 h-3" /> Tanggal
                      </div>
                      <div className="font-bold text-zinc-300">
                        {new Date(order.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Link 
                    to={`/payment/${order.id}`} 
                    className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-violet-500 hover:text-white transition-all group/btn"
                  >
                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Support Banner */}
        <div className="mt-24 p-12 rounded-[3rem] glass border-white/5 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-transparent to-fuchsia-600/5" />
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-4">Ada Masalah dengan Pesanan?</h3>
            <p className="text-zinc-500 mb-8 max-w-xl mx-auto font-light">
              Jika Anda mengalami kendala atau pesanan belum masuk setelah 15 menit, silakan hubungi tim support kami.
            </p>
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank" 
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-emerald-500 text-white font-black hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/20"
            >
              Hubungi WhatsApp Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
