import React from "react";
import { motion } from "motion/react";
import { cn, getAssetUrl } from "@/lib/utils";
const artisanSketch = getAssetUrl("/images/1000127699.png");
const artisanBench = getAssetUrl("/images/1000127700.png");
const artisanFinal = getAssetUrl("/images/1000127698.png");

const CRAFTSMANSHIP_STEPS = [
  {
    number: "01",
    title: "Vision & Sketch",
    cursive: "The Beginning",
    description:
      "Every masterpiece begins with a hand-drawn sketch, translating the client's dreams into an artistic blueprint that captures the soul of the piece.",
    image: artisanSketch,
  },
  {
    number: "02",
    title: "Stone Selection",
    cursive: "Pure Brillance",
    description:
      "Our gemologists travel the world to hand-select only the top 1% of ethically sourced diamonds and precious stones for unmatched brilliance.",
    image: artisanBench, // Reusing for now, will be styled differently Each step needs a distinct feel
  },
  {
    number: "03",
    title: "Master Crafting",
    cursive: "The Atelier",
    description:
      "Over 200 hours of meticulous hand-setting, sculpting and polishing by our seasoned artisans, using techniques passed down through five generations.",
    image: artisanFinal,
  },
];

const Heritage: React.FC = () => {
  return (
    <section
      id="heritage-section"
      className="relative overflow-hidden bg-[#0A0406] text-[#F5EAD8]"
    >
      {/* ——— ATMOSPHERIC BACKGROUND ——— */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 75% 20%, hsla(350, 75%, 15%, 0.45) 0%, transparent 60%),
              radial-gradient(circle at 5% 90%, hsla(350, 75%, 10%, 0.35) 0%, transparent 55%),
              linear-gradient(180deg, #110608 0%, #0A0406 50%, #1A080C 100%)
            `
          }}
        />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full blur-[80px] opacity-40"
          style={{ background: "radial-gradient(circle, hsla(350, 75%, 20%, 0.5), transparent 70%)" }}
        />
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -left-24 w-[350px] h-[350px] rounded-full blur-[80px] opacity-40"
          style={{ background: "radial-gradient(circle, hsla(350, 75%, 15%, 0.6), transparent 70%)" }}
        />
      </div>

      {/* Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1] bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Cfilter id=%22grain%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix type=%22saturate%22 values=%220%22/%3E%3C/filter%3E%3Crect width=%22300%22 height=%22300%22 filter=%22url(%23grain)%22 opacity=%221%22/%3E%3C/svg%3E')]" />

      {/* ——— HERO HEADER ——— */}
      <div className="relative z-10 pt-32 pb-20 text-center container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 md:gap-5 mb-8"
        >
          <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-secondary" />
          <span className="text-[clamp(2rem,6vw,3.75rem)] font-playfair-display uppercase tracking-widest text-secondary flex items-baseline leading-none">
            <span className="text-[clamp(4.5rem,10vw,8rem)] font-cormorant italic font-light leading-[0.8] -mr-2 text-secondary">H</span>ERITAGE
          </span>
          <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-secondary" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-baseline justify-center gap-x-3 md:gap-x-4 mb-10"
        >
          <span className="text-[clamp(3rem,8vw,6rem)] font-cormorant italic text-secondary leading-none">Master</span>
          <span className="text-[clamp(2.5rem,6.5vw,4.5rem)] font-playfair-display font-medium uppercase tracking-wider text-white leading-none">Artisans</span>
        </motion.h2>

        <div className="flex items-center justify-center gap-4 mb-20 max-w-sm mx-auto">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-secondary/60" />
          <div className="w-2 h-2 rotate-45 border border-secondary" />
          <div className="w-1.5 h-1.5 rotate-45 bg-secondary" />
          <div className="w-2 h-2 rotate-45 border border-secondary" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-secondary/60" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="max-w-xl mx-auto text-lg md:text-xl font-cormorant italic text-secondary/80 leading-relaxed mb-32"
        >
          Behind every masterpiece lies centuries of tradition, where gold and gems are transformed by the hands of our world-class artisans.
        </motion.p>
      </div>

      {/* ——— ASYMMETRICAL STORY BLOCKS ——— */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 space-y-40 pb-40">
        {CRAFTSMANSHIP_STEPS.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn(
              "flex flex-col md:flex-row items-center gap-12 md:gap-20",
              index % 2 !== 0 && "md:flex-row-reverse"
            )}
          >
            {/* Content Sidebar */}
            <div className="flex-1 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 bg-gradient-to-br from-secondary to-secondary/50 rotate-45" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-secondary font-bold">Step {step.number}</span>
              </div>
              
              <h3 className="text-[clamp(2.25rem,5vw,3.75rem)] font-playfair-display font-bold leading-tight">
                <span className="block text-secondary/90 italic font-cormorant font-light text-[clamp(2.5rem,6vw,4.5rem)] mb-2">{step.cursive}</span>
                {step.title}
              </h3>

              <p className="text-lg font-cormorant text-[#F5EAD8]/80 leading-relaxed max-w-md">
                {step.description}
              </p>

              <div className="pt-6 relative">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-secondary/20" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-secondary/60 py-4 flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-secondary" /> 
                  Uncompromising Excellence
                </p>
              </div>
            </div>

            {/* Large Image Frame */}
            <div className="flex-[1.4] w-full">
              <div className="relative img-frame group overflow-hidden border border-secondary/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-secondary/5 z-10 pointer-events-none" />
                <motion.img 
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.2 }}
                  src={step.image}
                  className={cn(
                    "w-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000",
                    index % 3 === 0 ? "h-[500px]" : index % 3 === 1 ? "h-[650px]" : "h-[450px]"
                  )}
                  alt={step.title}
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent z-20">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-secondary font-bold">House of Midas Atelier</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* ——— QUOTE SECTION ——— */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="max-w-4xl mx-auto py-20 px-10 relative bg-black/40 border-l-2 border-secondary"
        >
          <div className="absolute top-10 left-4 text-7xl font-playfair-display text-secondary/20 leading-none">"</div>
          <p className="text-2xl md:text-3xl font-cormorant italic text-white/90 leading-relaxed relative z-10">
            We do not merely craft jewelry — we preserve the dreams of those who wear them, immortalized in gold and light.
          </p>
          <div className="mt-10 flex flex-col">
            <span className="text-xs uppercase tracking-[0.4em] text-secondary font-bold">Élodie Midas</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-secondary/60 mt-2">Creative Director</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative separators */}
      <div className="container mx-auto px-12 mb-20 relative z-10">
        <div className="flex items-center gap-0">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-secondary/30 to-secondary/50" />
          <div className="px-8 flex items-center gap-3">
            <div className="w-1 h-1 rounded-full bg-secondary/60" />
            <div className="w-3 h-3 rotate-45 border border-secondary" />
            <div className="w-1.5 h-1.5 rotate-45 bg-secondary" />
            <div className="w-3 h-3 rotate-45 border border-secondary" />
            <div className="w-1 h-1 rounded-full bg-secondary/60" />
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-secondary/30 to-secondary/50" />
        </div>
      </div>
    </section>
  );
};

export default Heritage;
