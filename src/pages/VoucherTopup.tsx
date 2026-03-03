import { useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { productsConfig } from "../lib/products";
import { Button } from "../components/ui/Button";
import { 
  Gamepad2, 
  Flame, 
  ArrowLeft, 
  Check, 
  Info, 
  User, 
  Hash,
  ArrowRight
} from "lucide-react";

const getIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case "Gamepad2": return <Gamepad2 className={className} />;
    case "Flame": return <Flame className={className} />;
    default: return <Gamepad2 className={className} />;
  }
};

export default function VoucherTopup() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = productsConfig.find(p => p.id === productId && p.type === "voucher");

  const [userId, setUserId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  if (!product) {
    return <Navigate to="/products" />;
  }

  const handleContinue = () => {
    if (selectedItem && userId) {
      const params = new URLSearchParams({
        userId,
        ...(product.inputConfig?.hasZone ? { zoneId } : {})
      });
      navigate(`/checkout/${product.id}/${selectedItem}?${params.toString()}`);
    }
  };

  const isReady = selectedItem && userId && (product.inputConfig?.hasZone ? zoneId : true);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-12">
        <Link to="/products" className="text-sm text-zinc-500 hover:text-white transition-colors mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
        <div className="flex items-center gap-4 mt-4">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
            {getIcon(product.icon, "w-8 h-8 text-violet-400")}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name} Top Up</h1>
            <p className="text-zinc-400">{product.description}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Input ID & Item Selection */}
        <div className="lg:col-span-2 space-y-8">
          {/* Step 1: Input ID */}
          <section className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold text-sm">1</div>
              <h2 className="text-xl font-bold">Lengkapi Data</h2>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" /> {product.inputConfig?.idLabel}
                </label>
                <input 
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={product.inputConfig?.idPlaceholder}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                />
              </div>
              
              {product.inputConfig?.hasZone && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
                    <Hash className="w-4 h-4" /> {product.inputConfig?.zoneLabel}
                  </label>
                  <input 
                    type="text"
                    value={zoneId}
                    onChange={(e) => setZoneId(e.target.value)}
                    placeholder={product.inputConfig?.zonePlaceholder}
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                </div>
              )}
            </div>
            
            <div className="mt-6 p-4 rounded-xl bg-violet-500/5 border border-violet-500/10 flex gap-3 text-sm text-zinc-400">
              <Info className="w-5 h-5 text-violet-400 shrink-0" />
              <p>Pastikan User ID dan Zone ID sudah benar. Kesalahan input bukan tanggung jawab kami.</p>
            </div>
          </section>

          {/* Step 2: Item Selection */}
          <section className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center font-bold text-sm">2</div>
              <h2 className="text-xl font-bold">Pilih Nominal</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {product.categories.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative group ${
                    selectedItem === item.id 
                      ? "bg-violet-500/10 border-violet-500 shadow-lg shadow-violet-500/10" 
                      : "bg-zinc-900/50 border-white/5 hover:border-white/20"
                  }`}
                >
                  {item.popular && (
                    <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-violet-500 text-white text-[8px] font-bold uppercase rounded-full">
                      Best
                    </div>
                  )}
                  <div className="font-bold text-sm mb-1 group-hover:text-violet-400 transition-colors">{item.name}</div>
                  <div className="text-xs text-zinc-500">${item.price}</div>
                  
                  {selectedItem === item.id && (
                    <div className="absolute bottom-2 right-2">
                      <Check className="w-4 h-4 text-violet-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Summary & Checkout */}
        <div className="space-y-8">
          <section className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Ringkasan Pesanan</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Produk</span>
                <span className="text-zinc-200 font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Item</span>
                <span className="text-zinc-200 font-medium">
                  {selectedItem ? product.categories.find(c => c.id === selectedItem)?.name : "-"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">User ID</span>
                <span className="text-zinc-200 font-medium">{userId || "-"} {zoneId ? `(${zoneId})` : ""}</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 flex justify-between items-center mb-8">
              <span className="text-zinc-400 font-medium">Total Harga</span>
              <span className="text-3xl font-bold text-white">
                ${selectedItem ? product.categories.find(c => c.id === selectedItem)?.price : "0.00"}
              </span>
            </div>

            <Button 
              onClick={handleContinue}
              disabled={!isReady}
              size="lg" 
              className="w-full rounded-xl h-14 text-base font-medium bg-white text-black hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              Beli Sekarang <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <p className="mt-4 text-[10px] text-center text-zinc-600">
              Dengan mengklik Beli Sekarang, Anda menyetujui Syarat dan Ketentuan kami.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
