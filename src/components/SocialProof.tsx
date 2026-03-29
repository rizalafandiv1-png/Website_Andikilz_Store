import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, X, CheckCircle2 } from "lucide-react";

interface RecentOrder {
  id: string;
  name?: string;
  product_name: string;
  category_name: string;
  date: string;
  location: string;
}

const names = ["Andi", "Budi", "Siti", "Dewi", "Rizal", "Afandi", "Putri", "Eko", "Fajar", "Gita"];

export default function SocialProof() {
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch("/api/public/recent-orders");
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch social proof:", error);
      }
    };

    fetchRecentOrders();
    // Refresh every 5 minutes
    const interval = setInterval(fetchRecentOrders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    const showNotification = () => {
      setIsVisible(true);
      // Show for 5 seconds
      setTimeout(() => {
        setIsVisible(false);
        // Wait 10 seconds before showing the next one
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % orders.length);
        }, 10000);
      }, 5000);
    };

    // Initial delay
    const initialTimeout = setTimeout(showNotification, 5000);
    
    const cycleInterval = setInterval(showNotification, 20000); // 5s show + 15s wait

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(cycleInterval);
    };
  }, [orders]);

  if (orders.length === 0) return null;

  const currentOrder = orders[currentIndex];
  const displayName = currentOrder.name || names[currentIndex % names.length];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: -20 }}
          className="fixed bottom-6 left-6 z-[100] max-w-[320px] w-full"
        >
          <div className="glass rounded-2xl p-4 flex items-center gap-4 shadow-2xl border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-violet-500" />
            
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-6 h-6 text-violet-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold text-zinc-200">{displayName} dari {currentOrder.location}</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
              <p className="text-[11px] text-zinc-400 leading-tight">
                Baru saja membeli <span className="text-violet-300 font-semibold">{currentOrder.product_name}</span> - {currentOrder.category_name}
              </p>
              <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest font-bold">
                Berhasil Terverifikasi
              </p>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 p-1 text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
