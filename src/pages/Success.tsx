import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { CheckCircle2, ArrowRight, Clock, MessageCircle, ShoppingBag, ShieldCheck, Zap } from "lucide-react";

export default function Success() {
  const location = useLocation();
  const orderData = location.state?.order;

  if (!orderData) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <div className="relative w-32 h-32 mx-auto mb-12">
            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-full h-full rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-emerald-400" />
            </div>
          </div>

          <div className="space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3 h-3 fill-current" /> Pembayaran Berhasil
            </div>
            <h1 className="text-6xl font-black tracking-tight text-white">Pesanan Diterima!</h1>
            <p className="text-zinc-500 font-light text-xl max-w-xl mx-auto">
              Terima kasih telah berbelanja di <span className="text-white font-bold">Andikilz Store</span>. Pesanan Anda sedang kami proses dengan prioritas tinggi.
            </p>
          </div>

          {/* Order Summary Card */}
          <div className="relative group mb-16">
            <div className="absolute -inset-px bg-gradient-to-r from-emerald-500/20 to-violet-500/20 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            
            <div className="relative p-10 rounded-[3rem] glass border-white/5 text-left overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <h2 className="text-2xl font-black mb-10 flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-emerald-400" />
                Detail Pesanan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Produk & Paket</div>
                    <div className="text-xl font-black text-white">{orderData.product_name || orderData.productName}</div>
                    <div className="text-sm font-bold text-emerald-400 uppercase tracking-widest">{orderData.category_name || orderData.categoryName}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">ID Pesanan</div>
                    <div className="font-mono text-zinc-300 text-lg">#{orderData.id}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Status</div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                      <Clock className="w-3 h-3 animate-spin-slow" /> Sedang Diproses
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">Total Pembayaran</div>
                    <div className="text-3xl font-black text-white">Rp {orderData.price.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 font-black mb-6">01</div>
              <h4 className="font-bold text-white mb-2">Verifikasi Otomatis</h4>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">Sistem kami sedang memverifikasi pembayaran Anda secara otomatis.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-fuchsia-400 font-black mb-6">02</div>
              <h4 className="font-bold text-white mb-2">Proses Pengiriman</h4>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">Admin akan menyiapkan detail akun premium Anda dalam 5-15 menit.</p>
            </div>
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black mb-6">03</div>
              <h4 className="font-bold text-white mb-2">Selesai</h4>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">Detail akun akan dikirimkan melalui WhatsApp atau Email terdaftar.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/order-history" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto px-12 h-16 rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-xs">
                Lihat Riwayat Pesanan
              </Button>
            </Link>
            <Link to="/" className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto px-12 h-16 rounded-2xl bg-white text-black hover:bg-zinc-200 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                Kembali ke Beranda <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Support Info */}
          <p className="mt-16 text-zinc-600 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3">
            <ShieldCheck className="w-4 h-4" /> Transaksi Aman & Terenkripsi
          </p>
        </motion.div>
      </div>
    </div>
  );
}
