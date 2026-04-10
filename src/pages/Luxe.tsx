import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";
import { useProducts } from "@/hooks/useProducts";
import { getAssetUrl } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Luxe: React.FC = () => {
  const { products, loading } = useProducts();
  
  // Only use live Shopify products — no static fallback
  const displayProducts = products;
  const luxeProducts = displayProducts.slice(0, 3);

  if (loading && products.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#fdf8f2]">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--midas-gold)]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative min-h-screen bg-[#1a0509] flex flex-col items-center justify-center pt-20">
        {/* Immersive Header */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src={getAssetUrl("https://houseofmidas.in/cdn/shop/files/7_20231010_202432_0006.png?v=1696969542&width=3840")} 
            alt="Luxe Background" 
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0509] via-[#1a0509]/60 to-[#1a0509]" />
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.8em" }}
            className="text-[var(--midas-gold)] text-sm uppercase mb-6 block"
          >
            The Ultimate Expression
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-playfair-display font-bold text-white mb-8"
          >
            LUXE <span className="text-[var(--midas-gold)] italic">SERIES</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            className="h-px bg-[var(--midas-gold)] mx-auto mb-8"
          />
        </div>

        {/* Floating Accent */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce opacity-50">
          <span className="text-[10px] tracking-[0.4em] text-[var(--midas-gold)] uppercase mb-2">Scroll</span>
          <div className="w-px h-12 bg-[rgb:var(--midas-gold-rgb)/0.3]" />
        </div>
      </section>

      {/* Luxe Grid */}
      <section className="py-32 bg-[#fdf8f2] border-t border-[#1a0509]/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {luxeProducts.map((product: { id: string; image: string; name: string; description: string }, idx: number) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <div className="group cursor-pointer">
                  <div className="mb-6 rounded-2xl overflow-hidden aspect-[3/4] shadow-xl shadow-[#1a0509]/5">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      // Reduce scale on hover, shorten duration, and force GPU transform to avoid repaint/reflow flicker
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 transform-gpu"
                      style={{ willChange: 'transform' }}
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--midas-gold)] mb-3 block font-bold">Rare Edition</span>
                  <h3 className="text-2xl font-playfair-display font-bold mb-4 text-[#1a0509]">{product.name}</h3>
                  <p className="text-[#1a0509]/60 italic mb-6 text-sm">{product.description}</p>
                  <button className="text-xs uppercase tracking-widest text-[#1a0509] border-b border-[#1a0509]/30 pb-1 hover:border-[var(--midas-gold)] hover:text-[var(--midas-gold)] transition-colors">
                    Inquire for availability
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive Detail Section */}
      <section className="py-40 bg-[#1a0509] text-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 border-l border-t border-[var(--midas-gold)]/30" />
              <img 
                src={getAssetUrl("/images/slideshow/1000128418.png")} 
                alt="Craftsmanship" 
                className="w-full h-auto grayscale brightness-125"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-[var(--midas-gold)] text-xs uppercase tracking-[0.5em] mb-6 block font-bold">Savoir-Faire</span>
              <h2 className="text-4xl md:text-6xl font-playfair-display font-bold mb-8 leading-tight">
                Designed for the <span className="italic text-[var(--midas-gold)]">Extraordinary</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-10 italic">
                Our Luxe Series represents the pinnacle of House of Midas jewelry. Each piece is singular, crafted with rare ethically sourced diamonds and hand-forged metals.
              </p>
              <div className="flex space-x-12">
                <div>
                  <span className="block text-2xl font-playfair-display text-[var(--midas-gold)] mb-1">01</span>
                  <span className="font-jost text-[10px] uppercase tracking-widest opacity-60">Rare Minerals</span>
                </div>
                <div>
                  <span className="block text-2xl font-playfair-display text-[var(--midas-gold)] mb-1">240+</span>
                  <span className="font-jost text-[10px] uppercase tracking-widest opacity-60">Hours/Piece</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Luxe;
