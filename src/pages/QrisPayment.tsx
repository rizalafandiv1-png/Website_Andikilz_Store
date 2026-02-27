import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { productsConfig } from "../lib/products";
import { Button } from "../components/ui/Button";
import { MessageCircle, AlertCircle, ArrowLeft } from "lucide-react";

export default function QrisPayment() {
  const { productId, categoryId } = useParams();
  
  const product = productsConfig.find(p => p.id === productId);
  const category = product?.categories.find(c => c.id === categoryId);

  if (!product || !category) {
    return <Navigate to="/products" />;
  }

  // Convert USD to IDR for QRIS (approximate for display)
  const priceIDR = (category.price * 15500).toLocaleString('id-ID');

  return (
    <div className="max-w-2xl mx-auto px-6 py-24">
      <div className="mb-8">
        <Link to={`/checkout/${product.id}/${category.id}`} className="text-sm text-zinc-500 hover:text-white transition-colors mb-4 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Checkout
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 md:p-10 rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">QRIS Payment</h1>
          <p className="text-zinc-400">Scan the QR code below using your preferred E-Wallet or Mobile Banking app.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl mb-8 max-w-sm mx-auto flex flex-col items-center justify-center shadow-inner">
          {/* QRIS Image Placeholder */}
          <img 
            src="/qris.png" 
            alt="QRIS Payment Code" 
            className="w-full h-auto rounded-xl"
            onError={(e) => {
              // Fallback if image is missing
              e.currentTarget.src = "https://placehold.co/400x400/white/black?text=QRIS+Image+Not+Found\\nPlace+qris.png+in+public+folder";
            }}
          />
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center p-5 rounded-2xl bg-zinc-900/50 border border-white/5">
            <span className="text-zinc-400 font-medium">Total Amount</span>
            <div className="text-right">
              <div className="font-bold text-xl text-white">Rp {priceIDR}</div>
              <div className="text-sm text-zinc-500">(${category.price} USD)</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-5 rounded-2xl bg-zinc-900/50 border border-white/5">
            <span className="text-zinc-400 font-medium">Order ID</span>
            <span className="font-mono text-sm text-white bg-zinc-800 px-3 py-1 rounded-lg">
              ORD-{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-medium text-sm text-zinc-300 uppercase tracking-wider">Payment Instructions:</h3>
          <ol className="text-sm text-zinc-400 space-y-3 list-decimal list-inside bg-zinc-900/30 p-5 rounded-2xl border border-white/5">
            <li>Open your E-Wallet (OVO, GoPay, Dana) or Mobile Banking app.</li>
            <li>Select the <strong>Scan QR</strong> option.</li>
            <li>Scan the QRIS code above.</li>
            <li>Verify the amount and merchant name.</li>
            <li>Complete the payment.</li>
          </ol>
        </div>

        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm flex gap-3 mb-8">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">After completing the payment, please confirm via WhatsApp with your proof of payment to receive your account details.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            asChild
            className="flex-1 rounded-xl h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-base font-medium"
          >
            <a href={`https://wa.me/1234567890?text=Hello,%20I%20have%20made%20a%20payment%20for%20${product.name}%20-%20${category.name}.`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-5 h-5 mr-2" />
              Confirm via WhatsApp
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
