import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";

const AboutDesign: React.FC = () => {
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
              <span className="text-xs uppercase tracking-[0.5em] text-gold-500 mb-4 block font-medium">The Creative Process</span>
              <h1 className="text-5xl md:text-7xl font-playfair-display font-bold text-[#1a0509] mb-8">
                Designed by <span className="text-gold-500 italic">Emotion</span>
              </h1>
              <p className="text-[#1a0509]/70 text-lg italic max-w-2xl mx-auto">
                "Designing for us is a continuous journey of capturing light, form, and the personal stories of our community."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-[300px] mb-24 overflow-hidden shadow-2xl"
            >
              <img 
                src="https://houseofmidas.in/cdn/shop/files/3_20231010_202432_0002.png?v=1696968867&width=3840" 
                alt="Design Banner" 
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center mb-24">
              <div className="space-y-8">
                <h2 className="text-4xl font-playfair-display font-bold leading-tight text-[#1a0509]">From Vision to <br/><span className="text-gold-500 italic">Masterpiece</span></h2>
                <p className="text-[#1a0509]/70 leading-relaxed">
                  Our process begins with inspiration—whether it's the natural geometry of a rare gemstone or a client's heartfelt desire to commemorate a milestone.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 text-[#1a0509]">
                    <span className="text-2xl font-playfair-display text-gold-500/40 italic">01.</span>
                    <span className="text-lg font-medium">Conceptual Sketches</span>
                  </div>
                  <div className="flex items-center space-x-4 text-[#1a0509]">
                    <span className="text-2xl font-playfair-display text-gold-500/40 italic">02.</span>
                    <span className="text-lg font-medium">Digital CAD Renderings</span>
                  </div>
                  <div className="flex items-center space-x-4 text-[#1a0509]">
                    <span className="text-2xl font-playfair-display text-gold-500/40 italic">03.</span>
                    <span className="text-lg font-medium">Engineering Refinement</span>
                  </div>
                </div>
              </div>
              <div className="p-12 bg-white border border-[#1a0509]/10 relative">
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-gold-500/20" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-gold-500/20" />
                <h3 className="text-2xl font-playfair-display font-bold text-[#1a0509] mb-6 italic">Engineering Aesthetics</h3>
                <p className="text-[#1a0509]/70 leading-relaxed italic">
                  "A design is never static. It evolves as we challenge the engineering of a setting to maximize light refraction and ensure the comfort of the wearer. Truly fine jewelry must be as effortless to wear as it is beautiful to behold."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutDesign;
