import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Droplets, Sparkles, Wind, ShieldOff } from "lucide-react";

const JewelleryCare: React.FC = () => {
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
              <span className="text-xs uppercase tracking-[0.5em] text-[var(--midas-gold)] mb-4 block font-medium">Maintenance Guide</span>
              <h1 className="text-5xl md:text-8xl font-playfair-display font-bold text-[#1a0509] mb-8">
                Preserving <span className="text-[var(--midas-gold)] italic">Brilliance</span>
              </h1>
              <p className="text-[#1a0509]/70 text-lg italic max-w-2xl mx-auto">
                Fine jewelry is intended for a lifetime of wear, but it requires thoughtful care to maintain its original luster and security.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
              <div className="p-10 border border-[#1a0509]/10 bg-white/50">
                <div className="text-[var(--midas-gold)] mb-6">
                  <Droplets className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-playfair-display font-bold text-[#1a0509] mb-4">Cleaning</h3>
                <p className="text-[#1a0509]/70 leading-relaxed text-sm italic">
                  Clean your jewelry at home using warm water, a drop of mild dish soap, and a soft-bristled toothbrush. Rinse thoroughly and pat dry with a lint-free cloth.
                </p>
              </div>
              <div className="p-10 border border-[#1a0509]/10 bg-white/50">
                <div className="text-[var(--midas-gold)] mb-6">
                  <Wind className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-playfair-display font-bold text-[#1a0509] mb-4">Storage</h3>
                <p className="text-[#1a0509]/70 leading-relaxed text-sm italic">
                  Store each piece separately in its original HOM box or a soft pouch to prevent scratching. Keep your jewelry in a cool, dry place away from direct sunlight.
                </p>
              </div>
              <div className="p-10 border border-[#1a0509]/10 bg-white/50">
                <div className="text-[var(--midas-gold)] mb-6">
                  <ShieldOff className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-playfair-display font-bold text-[#1a0509] mb-4">Avoid Chemicals</h3>
                <p className="text-[#1a0509]/70 leading-relaxed text-sm italic">
                  Remove your jewelry before applying perfume, lotion, hairspray, or using household cleaners. Chemicals can dull stones and weaken metal settings.
                </p>
              </div>
              <div className="p-10 border border-[#1a0509]/10 bg-white/50">
                <div className="text-[var(--midas-gold)] mb-6">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-playfair-display font-bold text-[#1a0509] mb-4">Daily Care</h3>
                <p className="text-[#1a0509]/70 leading-relaxed text-sm italic">
                  Jewelry should be the last thing you put on and the first thing you take off. Avoid wearing delicate pieces while exercising or during strenuous activities.
                </p>
              </div>
            </div>

            <div className="bg-[#1a0509] text-white p-12 md:p-20 relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--midas-gold)]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
              <h2 className="text-3xl font-playfair-display font-bold mb-8">Professional Maintenance</h2>
              <p className="text-white/70 text-lg italic max-w-2xl mx-auto leading-relaxed mb-10">
                "We recommend bringing your House of Midas jewelry for a professional inspection and cleaning once a year to ensure stone security and maintain the rhodium finish."
              </p>
              <Link to="/contact">
                <button className="text-[var(--midas-gold)] text-xs uppercase tracking-[0.4em] font-bold border-b border-[var(--midas-gold)]/30 pb-2 hover:border-[var(--midas-gold)] transition-all">
                  Book a professional clean
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default JewelleryCare;
