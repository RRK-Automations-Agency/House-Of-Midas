import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";

const CELEBRITIES = [
  { name: "Nora Fatehi", piece: "Dolcii Band", image: "https://houseofmidas.in/cdn/shop/files/nora-hom-360x360.png?v=1690890468&width=3200" },
  { name: "Malaika Arora", piece: "Omera Ring", image: "https://houseofmidas.in/cdn/shop/files/malaika-hom-360x360.png?v=1690890468&width=3200" }
];

const AboutCommunity: React.FC = () => {
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
              <span className="text-sm uppercase tracking-[0.5em] text-[var(--midas-gold)] mb-4 block font-medium">HOM Community</span>
              <h1 className="text-5xl md:text-8xl font-playfair-display font-bold text-[#1a0509] mb-8">
                The House of <span className="text-[var(--midas-gold)] italic">Midas</span>
              </h1>
              <p className="text-[#1a0509]/70 text-xl leading-relaxed italic max-w-3xl mx-auto">
                "A collective of artists, dreamers, and collectors united by the pursuit of self-expression and timeless beauty."
              </p>
            </motion.div>

            {/* Celebrity Section */}
            <div className="mb-32">
              <div className="flex items-center justify-between mb-12 border-b border-[#1a0509]/10 pb-6 uppercase">
                <h2 className="text-2xl font-playfair-display font-bold text-[#1a0509]">As Seen On</h2>
                <span className="text-[10px] uppercase tracking-widest text-[#1a0509]/40">Certified Brilliance</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {CELEBRITIES.map((celeb, idx) => (
                  <motion.div
                    key={celeb.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    className="relative group overflow-hidden bg-muted"
                  >
                    <img 
                      src={celeb.image} 
                      alt={celeb.name} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0509]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                      <h3 className="text-2xl font-playfair-display text-white font-bold">{celeb.name}</h3>
                      <p className="text-[var(--midas-gold)] text-sm italic">Wearing the {celeb.piece}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-[#1a0509] text-white p-12 md:p-24 relative overflow-hidden mb-32">
              <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_top_right,rgba(184,134,11,0.1)_0%,transparent_70%)] pointer-events-none" />
              <div className="max-w-3xl mx-auto text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-playfair-display font-bold mb-12 italic">Voices of Our Community</h2>
                <div className="space-y-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-4"
                  >
                    <p className="text-lg md:text-2xl font-light leading-relaxed italic opacity-80">
                      "House of Midas didn't just sell me a ring; they helped me create a piece of my history. The process was as beautiful as the final result."
                    </p>
                    <span className="block text-[var(--midas-gold)] uppercase tracking-[0.3em] text-xs">— Dinaz Treger-Patel</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4"
                  >
                    <p className="text-lg md:text-2xl font-light leading-relaxed italic opacity-80">
                      "I've never felt so seen by a brand. Their community of self-love is truly inspiring."
                    </p>
                    <span className="block text-[var(--midas-gold)] uppercase tracking-[0.3em] text-xs">— Simran Singh</span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Interactive Design Link */}
            <div className="text-center py-24 bg-white border border-[#1a0509]/10">
              <span className="text-[var(--midas-gold)] text-[10px] uppercase tracking-[0.5em] mb-6 block font-bold">Your Legacy</span>
              <h2 className="text-3xl md:text-5xl font-playfair-display font-bold mb-8 text-[#1a0509]">Inspired by <span className="text-[var(--midas-gold)] italic">You</span></h2>
              <p className="text-[#1a0509]/70 max-w-xl mx-auto mb-10 leading-relaxed italic">
                Many of our signature pieces bear the names of the clients who commissioned them. Share your story with us and become part of the House of Midas legacy.
              </p>
              <button className="px-12 py-5 bg-[#1a0509] text-white uppercase tracking-[0.4em] text-xs font-bold transition-all hover:bg-[var(--midas-gold)] shadow-xl shadow-[#1a0509]/10">
                Join the Community
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutCommunity;
