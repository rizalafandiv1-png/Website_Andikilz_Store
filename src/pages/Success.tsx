import { Link, useLocation, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { CheckCircle2, ArrowRight, Clock, MessageCircle } from "lucide-react";

export default function Success() {
  const location = useLocation();
  const orderData = location.state?.order;

  if (!orderData) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-4">Pesanan Berhasil!</h1>
        <p className="text-xl text-zinc-400 mb-12">
          Terima kasih telah berbelanja di Andikilz Store. Pesanan Anda sedang kami proses.
        </p>

        <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 mb-12 text-left">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-400" /> Ringkasan Pesanan
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-white/5">
              <span className="text-zinc-500">Produk</span>
              <span className="font-medium text-zinc-200">{orderData.productName}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/5">
              <span className="text-zinc-500">Paket</span>
              <span className="font-medium text-zinc-200">{orderData.categoryName}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-white/5">
              <span className="text-zinc-500">ID Pesanan</span>
              <span className="font-mono text-zinc-200">{orderData.id}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-zinc-500">Total Pembayaran</span>
              <span className="font-bold text-white text-lg">Rp {orderData.price.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-12 text-left">
          <h3 className="font-medium text-sm text-zinc-300 uppercase tracking-wider">Langkah Selanjutnya:</h3>
          <div className="grid gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 text-violet-400 font-bold text-sm">1</div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Pastikan Anda sudah mengirimkan bukti pembayaran melalui WhatsApp.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 text-violet-400 font-bold text-sm">2</div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Admin kami akan memverifikasi pembayaran Anda dalam waktu 5-15 menit.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0 text-violet-400 font-bold text-sm">3</div>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Detail akun premium akan dikirimkan langsung melalui WhatsApp atau email Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild variant="outline" className="flex-1 rounded-xl h-14 border-white/10 hover:bg-white/5">
            <Link to="/order-history">Lihat Riwayat Pesanan</Link>
          </Button>
          <Button asChild className="flex-1 rounded-xl h-14 bg-white text-black hover:bg-zinc-200">
            <Link to="/" className="flex items-center justify-center gap-2">
              Kembali ke Beranda <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
