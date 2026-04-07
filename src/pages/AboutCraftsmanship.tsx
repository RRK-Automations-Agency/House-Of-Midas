import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";

const AboutCraftsmanship: React.FC = () => {
  return (
    <Layout>
      <section className="relative pt-10 pb-24 bg-[#fdf8f2] overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-20 text-center"
            >
              <span className="text-xs uppercase tracking-[0.5em] text-[#d4a843] mb-4 block font-medium">Savoir-Faire</span>
              <h1 className="text-5xl md:text-7xl font-playfair-display font-bold text-[#1a0509] mb-8">
                Master <span className="text-[#d4a843] italic">Artisanship</span>
              </h1>
              <p className="text-[#1a0509]/70 text-lg italic max-w-2xl mx-auto">
                "Each piece is a singular labor of love, handcrafted in our state-of-the-art facility by master jewelers with over 30 years of experience."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[300px] mb-24 overflow-hidden shadow-2xl"
            >
              <img 
                src="https://houseofmidas.in/cdn/shop/files/1_20231010_202432_0000.png?v=1696968135&width=3840" 
                alt="Craftsmanship Banner" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-24">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 className="text-4xl font-playfair-display font-bold text-[#1a0509]">The Heritage of <br/><span className="text-[#d4a843] italic">Hands</span></h2>
                <div className="h-px w-16 bg-[#d4a843]/30" />
                <p className="text-[#1a0509]/70 leading-relaxed italic">
                  Our artisans hail from Kolkata, India—a city world-renowned for its lineage of master goldsmiths and stone setters. With techniques passed down through generations, they bring a soul to the metal that no machine can replicate.
                </p>
                <p className="text-[#1a0509]/70 leading-relaxed">
                  We advocate for "slow treasures"—heirlooms that endure through time, rather than disposable seasonal jewelry.
                </p>
              </motion.div>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-8 border border-[#1a0509]/10 bg-white">
                  <span className="block text-4xl font-playfair-display text-[#d4a843] mb-2 font-bold">30+</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1a0509]/60">Years Experience</span>
                </div>
                <div className="text-center p-8 border border-[#1a0509]/10 bg-white">
                  <span className="block text-4xl font-playfair-display text-[#d4a843] mb-2 font-bold">12</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1a0509]/60">Days of Craft</span>
                </div>
                <div className="text-center p-8 border border-[#1a0509]/10 bg-white">
                  <span className="block text-4xl font-playfair-display text-[#d4a843] mb-2 font-bold">100%</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1a0509]/60">In-House</span>
                </div>
                <div className="text-center p-8 border border-[#1a0509]/10 bg-white">
                  <span className="block text-4xl font-playfair-display text-[#d4a843] mb-2 font-bold">0.1%</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#1a0509]/60">Gem Selection</span>
                </div>
              </div>
            </div>

            <div className="bg-foreground text-primary-foreground p-12 md:p-20 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <img src="https://houseofmidas.in/cdn/shop/files/inspired-hom_png.webp?v=1690888315&width=1500" alt="Detail" className="w-full h-full object-cover" />
               </div>
               <div className="relative z-10">
                 <h2 className="text-3xl md:text-5xl font-playfair-display font-bold mb-8">Dispatched with Care</h2>
                <p className="text-white/70 text-lg italic max-w-2xl mx-auto leading-relaxed">
                   "Every piece is meticulously inspected and verified before it leaves our atelier. We ship globally with full insurance, ensuring your heritage arrives safely."
                 </p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutCraftsmanship;
