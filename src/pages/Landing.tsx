import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Zap, Shield, MonitorPlay, CreditCard, Mail, ArrowRight, Star, Users, CheckCircle2, Globe } from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-[#050505] text-zinc-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-30 bg-gradient-to-b from-violet-600/40 via-fuchsia-600/20 to-transparent blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-xs font-medium tracking-wider uppercase text-violet-400 mb-4">
              <Star className="w-3 h-3 fill-current" /> Trusted by 10,000+ Customers
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.95] md:leading-[0.9]">
              Akses Digital <br />
              <span className="text-gradient">Premium Instan.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
              Dapatkan akun premium individual untuk alat digital dan platform hiburan terbaik di dunia dengan harga jauh lebih murah.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-2xl bg-white text-black hover:bg-zinc-200 text-lg h-16 px-10 font-bold shadow-2xl shadow-white/10 transition-all hover:scale-105 active:scale-95">
                <Link to="/products">Jelajahi Produk <ArrowRight className="ml-2 w-5 h-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-2xl border-white/10 glass hover:bg-white/5 text-lg h-16 px-10 font-medium transition-all hover:scale-105 active:scale-95">
                <Link to="/order-history">Lihat Riwayat</Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 pt-12 text-sm text-zinc-500 font-medium">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border-white/5"><Zap className="w-4 h-4 text-violet-400" /> Pengiriman Instan</div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border-white/5"><Shield className="w-4 h-4 text-fuchsia-400" /> Pembayaran Aman</div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border-white/5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Garansi Penuh</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Kenapa Memilih Kami?</h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto font-light">Kami memberikan pengalaman terbaik untuk kebutuhan digital Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
            {/* Main Feature */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 p-10 rounded-[2.5rem] glass border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-600/30 transition-all duration-500" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-8">
                    <Zap className="w-8 h-8 text-violet-400" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">Pengiriman Kilat</h3>
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    Sistem kami bekerja secara otomatis 24/7. Setelah pembayaran terverifikasi, detail akun Anda akan langsung dikirimkan tanpa menunggu admin.
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                        <Users className="w-4 h-4 text-zinc-500" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-zinc-500 font-medium">Bergabung dengan ribuan pengguna puas lainnya.</span>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 p-10 rounded-[2.5rem] glass border-white/5 relative overflow-hidden group"
            >
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-emerald-600/10 blur-[60px] rounded-full translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-600/20 transition-all duration-500" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Garansi Penuh</h3>
                  <p className="text-zinc-400">
                    Setiap pembelian dilindungi garansi sesuai durasi paket. Jika ada kendala, tim support kami siap membantu Anda kapan saja.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-[2.5rem] glass border-white/5 flex flex-col items-center text-center justify-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h4 className="font-bold mb-1">QRIS & E-Wallet</h4>
              <p className="text-xs text-zinc-500">Mendukung semua metode pembayaran lokal.</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-[2.5rem] glass border-white/5 flex flex-col items-center text-center justify-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6 text-violet-400" />
              </div>
              <h4 className="font-bold mb-1">Akses Global</h4>
              <p className="text-xs text-zinc-500">Layanan premium dari seluruh dunia.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-y border-white/5 bg-zinc-900/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Pelanggan Aktif", value: "10K+" },
              { label: "Pesanan Selesai", value: "50K+" },
              { label: "Layanan Tersedia", value: "20+" },
              { label: "Rating Kepuasan", value: "4.9/5" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">{stat.value}</div>
                <div className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-16 rounded-[3rem] glass border-white/10 shadow-2xl shadow-violet-500/5"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Siap Upgrade Pengalaman Digital Anda?</h2>
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light">
              Dapatkan akses premium sekarang dan nikmati fitur terbaik tanpa batasan.
            </p>
            <Button asChild size="lg" className="rounded-2xl bg-white text-black hover:bg-zinc-200 text-xl h-18 px-12 font-bold transition-all hover:scale-105 active:scale-95">
              <Link to="/products">Mulai Sekarang</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
