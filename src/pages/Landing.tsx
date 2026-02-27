import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Zap, Shield, MonitorPlay, CreditCard, Mail } from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-[#050505] text-zinc-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20 bg-gradient-to-b from-violet-600 to-fuchsia-600 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
              Premium Digital Access. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                Instantly Delivered.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Get individual premium accounts for the world's best digital tools and entertainment platforms at a fraction of the retail price.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto rounded-full bg-white text-black hover:bg-zinc-200 text-base h-14 px-8">
                <Link to="/products">Explore Products</Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 pt-8 text-sm text-zinc-500 font-medium">
              <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-violet-400" /> Instant Delivery</div>
              <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-fuchsia-400" /> Secure Checkout</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-zinc-900/20 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-zinc-400">Get your premium account in less than 2 minutes.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
            
            {[
              {
                icon: <MonitorPlay className="w-6 h-6 text-violet-400" />,
                title: "1. Choose Product",
                desc: "Select your desired premium service, category, and duration."
              },
              {
                icon: <CreditCard className="w-6 h-6 text-fuchsia-400" />,
                title: "2. Secure Payment",
                desc: "Checkout securely via Stripe using your preferred payment method."
              },
              {
                icon: <Mail className="w-6 h-6 text-emerald-400" />,
                title: "3. Instant Delivery",
                desc: "Receive your premium account credentials instantly via email."
              }
            ].map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-8 rounded-3xl bg-[#050505] border border-white/5 text-center flex flex-col items-center"
              >
                <div className="w-14 h-14 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 text-white relative z-10">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
