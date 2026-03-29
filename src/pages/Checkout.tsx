import { useState, useEffect } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { 
  QrCode, 
  CreditCard, 
  Loader2, 
  ChevronLeft, 
  ShieldCheck, 
  Zap, 
  Lock,
  ShoppingCart,
  CheckCircle2,
  Package,
  MonitorPlay,
  Palette,
  Bot,
  Gamepad2,
  Flame,
  Smartphone,
  Tv,
  Music
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

// Helper to map icon names to components
const getIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case "MonitorPlay": return <MonitorPlay className={className} />;
    case "Palette": return <Palette className={className} />;
    case "Bot": return <Bot className={className} />;
    case "Gamepad2": return <Gamepad2 className={className} />;
    case "Flame": return <Flame className={className} />;
    case "Smartphone": return <Smartphone className={className} />;
    case "Tv": return <Tv className={className} />;
    case "Music": return <Music className={className} />;
    case "ShieldCheck": return <ShieldCheck className={className} />;
    default: return <Package className={className} />;
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function Checkout() {
  const { productId, categoryId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string | null>("qris");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [creatingOrder, setCreatingOrder] = useState(false);

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

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-zinc-500 font-medium tracking-widest uppercase text-xs">Menyiapkan Checkout...</p>
      </div>
    );
  }

  if (!product || !category) {
    return <Navigate to="/products" />;
  }

  const handleContinue = async () => {
    if (!user) {
      navigate("/login", { state: { from: window.location.pathname + window.location.search } });
      return;
    }

    if (selectedMethod === "qris") {
      setCreatingOrder(true);
      const searchParams = new URLSearchParams(window.location.search);
      const userId = searchParams.get("userId") || "";
      const zoneId = searchParams.get("zoneId") || "";
      
      const orderId = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
      
      try {
        // 1. Create order in Firestore
        const newOrder = {
          id: orderId,
          userId: user.uid,
          productName: product.name,
          categoryName: category.name,
          price: category.price,
          date: new Date().toISOString(),
          targetId: userId,
          zoneId: zoneId
        };

        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newOrder),
        });
        
        if (!orderResponse.ok) throw new Error("Gagal membuat pesanan");

        // 2. Create Midtrans transaction
        const paymentResponse = await fetch("/api/payments/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
            amount: category.price,
            customerDetails: {
              first_name: user.displayName || user.email?.split('@')[0],
              email: user.email,
            },
            itemDetails: [{
              id: category.id,
              price: category.price,
              quantity: 1,
              name: `${product.name} - ${category.name}`
            }]
          }),
        });

        const paymentData = await paymentResponse.json();
        
        if (paymentData.token) {
          // @ts-ignore
          window.snap.pay(paymentData.token, {
            onSuccess: function(result: any) {
              console.log('success', result);
              navigate("/success");
            },
            onPending: function(result: any) {
              console.log('pending', result);
              navigate(`/payment/${orderId}`);
            },
            onError: function(result: any) {
              console.log('error', result);
              alert("Pembayaran gagal. Silakan coba lagi.");
            },
            onClose: function() {
              console.log('customer closed the popup without finishing the payment');
              navigate(`/payment/${orderId}`);
            }
          });
        } else {
          throw new Error("Gagal mendapatkan token pembayaran");
        }
      } catch (error) {
        console.error("Checkout failed:", error);
        alert("Terjadi kesalahan. Silakan coba lagi.");
      } finally {
        setCreatingOrder(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 mb-12">
          <Link to={`/products/${product.id}/${category.id}`} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Detail Produk
          </Link>
          <div className="w-1 h-1 rounded-full bg-zinc-800" />
          <span className="text-sm font-bold text-zinc-300">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Payment Methods */}
          <div className="lg:col-span-7 space-y-10">
            <div>
              <h1 className="text-4xl font-black tracking-tight mb-4">Metode Pembayaran</h1>
              <p className="text-zinc-400 font-light">Pilih metode pembayaran yang paling nyaman untuk Anda.</p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setSelectedMethod("qris")}
                className={`w-full group relative flex items-center justify-between p-8 rounded-[2.5rem] border transition-all overflow-hidden ${
                  selectedMethod === "qris" 
                    ? "bg-violet-500/10 border-violet-500/50 shadow-2xl shadow-violet-500/10" 
                    : "bg-zinc-900/20 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="relative z-10 flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                    selectedMethod === "qris" ? "bg-violet-500 text-white" : "bg-zinc-900 text-zinc-500"
                  }`}>
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-xl mb-1">QRIS</div>
                    <div className="text-sm text-zinc-500 font-medium">Bayar instan via GoPay, OVO, Dana, LinkAja, atau Mobile Banking.</div>
                  </div>
                </div>
                <div className={`relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedMethod === "qris" ? "border-violet-500 bg-violet-500" : "border-zinc-800"
                }`}>
                  {selectedMethod === "qris" && <CheckCircle2 className="w-5 h-5 text-white" />}
                </div>

                {selectedMethod === "qris" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-transparent" />
                )}
              </button>

              <div className="w-full flex items-center justify-between p-8 rounded-[2.5rem] border border-white/5 bg-zinc-900/10 opacity-40 grayscale cursor-not-allowed">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-zinc-700 flex items-center justify-center">
                    <CreditCard className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <div className="font-black text-xl mb-1 text-zinc-600">Kartu Kredit / Debit</div>
                    <div className="text-sm text-zinc-700 font-medium">Segera hadir sebagai opsi pembayaran tambahan.</div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Coming Soon
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="p-8 rounded-[2.5rem] glass border-white/5 flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">Keamanan Terjamin</h4>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Semua transaksi diproses melalui gateway pembayaran resmi yang terenkripsi dan diawasi oleh Bank Indonesia. Data Anda aman bersama kami.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="p-10 rounded-[3rem] glass border-white/10 sticky top-32 shadow-2xl shadow-black/50 overflow-hidden">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <h2 className="relative z-10 text-2xl font-black mb-10 flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-violet-400" />
                Ringkasan Pesanan
              </h2>
              
              <div className="relative z-10 space-y-8 mb-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0">
                    {getIcon(product.icon, "w-10 h-10 text-violet-400")}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-white text-lg mb-1">{product.name}</div>
                    <div className="text-sm font-bold text-violet-400 uppercase tracking-widest">{category.name}</div>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-medium">Harga Paket</span>
                    <span className="text-white font-bold">{formatPrice(category.price)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-medium">Biaya Layanan</span>
                    <span className="text-emerald-400 font-bold uppercase tracking-widest text-[10px]">Gratis</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 pt-8 border-t border-white/5 flex justify-between items-center mb-10">
                <span className="font-black text-zinc-400 uppercase tracking-widest text-xs">Total Bayar</span>
                <span className="text-4xl font-black text-white">{formatPrice(category.price)}</span>
              </div>

              <div className="relative z-10">
                <Button 
                  onClick={handleContinue}
                  disabled={!selectedMethod || creatingOrder}
                  size="lg" 
                  className="w-full rounded-2xl h-20 text-xl font-black bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-white/5"
                >
                  {creatingOrder ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      Bayar Sekarang
                      <Zap className="w-5 h-5 fill-current" />
                    </div>
                  )}
                </Button>
                <p className="mt-6 text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                  <Lock className="w-3 h-3" /> Secure Checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
