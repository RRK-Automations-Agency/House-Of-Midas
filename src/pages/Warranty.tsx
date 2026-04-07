import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";
import { ShieldCheck, RefreshCcw } from "lucide-react";

const Warranty: React.FC = () => {
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
              <span className="text-xs uppercase tracking-[0.5em] text-gold-500 mb-4 block font-medium">Peace of Mind</span>
              <h1 className="text-5xl md:text-7xl font-playfair-display font-bold text-[#1a0509] mb-8">
                The HOM <span className="text-gold-500 italic">Warranty</span>
              </h1>
              <p className="text-[#1a0509]/70 text-lg italic max-w-2xl mx-auto">
                "We stand behind the quality of our craftsmanship for a lifetime. Every piece you purchase is protected by our commitment to excellence."
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
              <div className="p-10 border border-[#1a0509]/10 bg-white/50 flex flex-col items-center text-center">
                <ShieldCheck className="w-12 h-12 text-gold-500 mb-6" />
                <h3 className="text-xl font-playfair-display font-bold text-[#1a0509] mb-4 uppercase tracking-widest">2-Year Professional Warranty</h3>
                <p className="text-[#1a0509]/70 text-sm italic leading-relaxed">
                  Covers all manufacturing defects and ensures your jewelry receives professional care during its first two years of life.
                </p>
              </div>
              <div className="p-10 border border-[#1a0509]/10 bg-white/50 flex flex-col items-center text-center">
                <RefreshCcw className="w-12 h-12 text-gold-500 mb-6" />
                <h3 className="text-xl font-playfair-display font-bold text-[#1a0509] mb-4 uppercase tracking-widest">Lifetime Servicing</h3>
                <p className="text-[#1a0509]/70 text-sm italic leading-relaxed">
                  Complimentary professional cleaning and inspection for the lifetime of your jewelry, ensuring it always looks its best.
                </p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="border-l-4 border-gold-500 pl-10 py-4">
                <h3 className="text-2xl font-playfair-display font-bold text-[#1a0509] mb-4">What's Covered?</h3>
                <ul className="space-y-4 text-[#1a0509]/70 italic">
                  <li className="flex items-center space-x-3">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                    <span>Manufacturing defects in craftsmanship or materials.</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                    <span>Replacement of lost accent diamonds or gemstones.</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                    <span>Professional resizing (where design allows).</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                    <span>Rhodium plating and polishing to restore luster.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[#1a0509] text-white p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-md">
                  <h3 className="text-2xl font-playfair-display font-bold mb-4">Certificate of Authenticity</h3>
                  <p className="text-white/70 italic text-sm leading-relaxed">
                    Every piece is accompanied by a digital certificate of authenticity, detailing the metal purity, gemstone weight, and unique serial number.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Warranty;
