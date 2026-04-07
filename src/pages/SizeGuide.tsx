import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

const SizeGuide: React.FC = () => {
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
              <span className="text-xs uppercase tracking-[0.5em] text-gold-500 mb-4 block font-medium">The Perfect Fit</span>
              <h1 className="text-5xl md:text-7xl font-playfair-display font-bold text-[#1a0509] mb-8">
                Size <span className="text-gold-500 italic">Guide</span>
              </h1>
              <p className="text-[#1a0509]/70 text-lg italic max-w-2xl mx-auto">
                Fine jewelry should sit as though it were part of you. Use our guides to find the perfect dimensions for your next heirloom.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-24 items-start">
              {/* Ring Sizing */}
              <div className="space-y-8 bg-white/30 p-8 border border-[#1a0509]/5 h-full">
                <h3 className="text-2xl font-playfair-display font-bold text-gold-500 border-b border-[#1a0509]/10 pb-4 italic">Ring Sizing</h3>
                <p className="text-[#1a0509]/70 text-sm italic leading-relaxed">
                  Measure the inner diameter of a ring that fits perfectly, or wrap a piece of string around your finger for the circumference.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px] text-left italic text-[#1a0509]">
                    <thead className="text-[10px] uppercase tracking-widest text-gold-500 border-b border-[#1a0509]/10">
                      <tr>
                        <th className="py-4 font-bold">Dia(mm)</th>
                        <th className="py-4 font-bold">US</th>
                        <th className="py-4 font-bold">UK</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a0509]/5">
                      <tr><td className="py-2">14.1</td><td className="py-2">3</td><td className="py-2">F 1/2</td></tr>
                      <tr><td className="py-2">14.9</td><td className="py-2">4</td><td className="py-2">H 1/2</td></tr>
                      <tr><td className="py-2">15.7</td><td className="py-2">5</td><td className="py-2">J 1/2</td></tr>
                      <tr><td className="py-2">16.5</td><td className="py-2">6</td><td className="py-2">L 1/2</td></tr>
                      <tr><td className="py-2">17.3</td><td className="py-2">7</td><td className="py-2">N 1/2</td></tr>
                      <tr><td className="py-2">18.1</td><td className="py-2">8</td><td className="py-2">P 1/2</td></tr>
                      <tr><td className="py-2">19.0</td><td className="py-2">9</td><td className="py-2">R 1/2</td></tr>
                      <tr><td className="py-2">19.8</td><td className="py-2">10</td><td className="py-2">T 1/2</td></tr>
                      <tr><td className="py-2">20.6</td><td className="py-2">11</td><td className="py-2">V 1/2</td></tr>
                      <tr><td className="py-2">21.4</td><td className="py-2">12</td><td className="py-2">X 1/2</td></tr>
                    </tbody>
                  </table>
                  <p className="text-[10px] text-[#1a0509]/50 mt-4">* More sizes available upon request.</p>
                </div>
              </div>

              {/* Necklace Lengths */}
              <div className="space-y-8 bg-white/30 p-8 border border-[#1a0509]/5 h-full">
                <h3 className="text-2xl font-playfair-display font-bold text-gold-500 border-b border-[#1a0509]/10 pb-4 italic">Necklace Lengths</h3>
                <p className="text-[#1a0509]/70 text-sm italic leading-relaxed">
                  Choosing the right length depends on your style and the necklace's intended position.
                </p>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-[#1a0509]/5 pb-4">
                    <div>
                      <span className="block font-bold text-sm text-[#1a0509]">16 Inches (40cm)</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#1a0509]/50 italic">Choker Style</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#1a0509]/5 pb-4">
                    <div>
                      <span className="block font-bold text-sm text-[#1a0509]">18 Inches (45cm)</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#1a0509]/50 italic">Standard Princess</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#1a0509]/5 pb-4">
                    <div>
                      <span className="block font-bold text-sm text-[#1a0509]">20 Inches (50cm)</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#1a0509]/50 italic">Matinee Length</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#1a0509]/5 pb-4">
                    <div>
                      <span className="block font-bold text-sm text-[#1a0509]">24 Inches (60cm)</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#1a0509]/50 italic">Opera Length</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bracelet Sizing */}
              <div className="space-y-8 bg-white/30 p-8 border border-[#1a0509]/5 h-full">
                <h3 className="text-2xl font-playfair-display font-bold text-gold-500 border-b border-[#1a0509]/10 pb-4 italic">Bracelet Sizing</h3>
                <p className="text-[#1a0509]/70 text-sm italic leading-relaxed">
                  Measure your wrist circumference snugly. Add 1-2 cm for your preferred comfort.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px] text-left italic text-[#1a0509]">
                    <thead className="text-[10px] uppercase tracking-widest text-gold-500 border-b border-[#1a0509]/10">
                      <tr>
                        <th className="py-4 font-bold">Wrist (cm)</th>
                        <th className="py-4 font-bold">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a0509]/5">
                      <tr><td className="py-3">14.0 - 15.0</td><td className="py-3 font-semibold">Extra Small</td></tr>
                      <tr><td className="py-3">15.1 - 16.0</td><td className="py-3 font-semibold">Small</td></tr>
                      <tr><td className="py-3">16.1 - 17.0</td><td className="py-3 font-semibold">Medium</td></tr>
                      <tr><td className="py-3">17.1 - 18.0</td><td className="py-3 font-semibold">Large</td></tr>
                      <tr><td className="py-3">18.1 - 19.5</td><td className="py-3 font-semibold">Extra Large</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-12 bg-white border border-[#1a0509]/10 text-center">
               <h3 className="text-2xl font-playfair-display font-bold text-[#1a0509] mb-6 italic">Need a physical sizer?</h3>
               <p className="text-[#1a0509]/70 mb-8 italic">We can ship a complimentary physical ring sizer to your doorstep.</p>
               <Link 
                 to="/contact"
                 className="inline-block px-12 py-4 bg-[#1a0509] text-white uppercase tracking-[0.3em] text-[10px] font-bold shadow-xl shadow-[#1a0509]/10 hover:bg-gold-500 transition-all"
               >
                 Order Free Sizer
               </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SizeGuide;
