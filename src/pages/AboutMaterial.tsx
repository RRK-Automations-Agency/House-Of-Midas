import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";
import { ShieldCheck, Gem, Zap } from "lucide-react";

const AboutMaterial: React.FC = () => {
  return (
    <Layout>
      <section className="relative pt-14 pb-24 bg-[#fdf8f2] overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-20 text-center"
            >
              <span className="text-xs uppercase tracking-[0.5em] text-[var(--midas-gold)] mb-4 block font-medium">The Materials</span>
              <h1 className="text-5xl md:text-7xl font-playfair-display font-bold text-[#1a0509] mb-8">
                Pure <span className="text-[var(--midas-gold)] italic">Integrity</span>
              </h1>
              <p className="text-[#1a0509]/70 text-lg italic max-w-2xl mx-auto">
                "Our foundation is built on uncompromising quality, sourcing only the finest metals and ethically-grown gemstones."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-[300px] mb-24 overflow-hidden shadow-2xl"
            >
              <img 
                src="https://houseofmidas.in/cdn/shop/files/2_20231010_202432_0001.png?v=1696968867&width=3840" 
                alt="Materials Banner" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="mt-2 text-[var(--midas-gold)]">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-playfair-display font-bold text-[#1a0509] mb-2">925 Sterling Silver</h3>
                  <p className="text-[#1a0509]/70 leading-relaxed italic">
                    Our foundation is 92.5% pure silver blended with 7.5% copper for durability. This ensures your jewelry remains timeless and resilient.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="mt-2 text-[var(--midas-gold)]">
                  <Zap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-playfair-display font-bold text-[#1a0509] mb-2">14K & 18K Solid Gold</h3>
                  <p className="text-[#1a0509]/70 leading-relaxed italic mb-4">
                    We offer our creations in both 14K and 18K gold, providing a balance of purity and durability. Every piece is available in three signature finishes to suit your personal style.
                  </p>
                  <div className="flex items-center gap-6 p-4 bg-white/50 border border-[#1a0509]/10 rounded-none">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#E6BE8A] shadow-inner" />
                      <span className="text-[9px] uppercase tracking-widest text-[#1a0509]/70 font-bold">Yellow Gold</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#E5CDC8] shadow-inner" />
                      <span className="text-[9px] uppercase tracking-widest text-[#1a0509]/70 font-bold">Rose Gold</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#E5E5E5] shadow-inner" />
                      <span className="text-[9px] uppercase tracking-widest text-[#1a0509]/70 font-bold">White Gold</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="mt-2 text-[var(--midas-gold)]">
                  <Gem className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-playfair-display font-bold text-[#1a0509] mb-2">Conscious Stones</h3>
                  <p className="text-[#1a0509]/70 leading-relaxed italic">
                    From brilliant Moissanites to ethical Lab-Grown Diamonds, we select only the top 0.1% of stones that meet our standards of light and clarity.
                  </p>
                </div>
              </div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-[#1a0509]/10 p-12 text-center relative"
            >
                     <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[rgb:var(--midas-gold-rgb)/0.4]" />
                     <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[rgb:var(--midas-gold-rgb)/0.4]" />
              <h4 className="text-2xl font-playfair-display font-bold mb-6 text-[#1a0509]">The 2-Year Warranty</h4>
              <p className="text-[#1a0509]/70 leading-relaxed mb-8 italic">
                Every creation comes with our comprehensive 2-year warranty covering manufacturing issues, professional cleaning, and even the loss of stones.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutMaterial;
