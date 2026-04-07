import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";

const About: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-foreground">
        <div className="absolute inset-0 z-0 scale-105">
          <img 
            src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_9801c9c4-d760-48a7-a64e-07beccf246ec.jpg" 
            alt="Jewelry Workshop" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/80 via-transparent to-foreground" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary text-xs uppercase tracking-[0.8em] font-medium mb-8 block"
          >
            Since 1994
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-playfair-display font-bold text-primary-foreground mb-6"
          >
            The <span className="text-secondary italic">Heritage</span>
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.5 }}
            className="h-px bg-secondary mx-auto mb-8"
          />
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <span className="text-primary text-[10px] uppercase tracking-[0.5em] font-bold">The Origin</span>
              <h2 className="text-4xl md:text-6xl font-playfair-display font-bold leading-tight">
                Crafting Legacies <br/>Of <span className="text-primary italic">Light</span>
              </h2>
              <div className="h-px w-16 bg-border" />
              <p className="text-muted-foreground text-lg leading-relaxed italic">
                House of Midas was born from a singular vision: to bring the core level of jewelry making directly to those who appreciate true artistry. What started as a small atelier of master artisans has evolved into a sanctuary for rare gems and timeless design.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We believe that jewelry is more than an adornment—it is a vessel for history, emotion, and the personal legacy of its wearer.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] bg-muted overflow-hidden"
            >
              <img 
                src="https://miaoda-site-img.s3cdn.medo.dev/images/KLing_KLing_3cc1b24c-f465-4f18-a195-6c568bcdccc6.jpg" 
                alt="Brand Story" 
                className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-110"
              />
              <div className="absolute inset-12 border border-white/20 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Highlights */}
      <section className="py-32 bg-foreground text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-24">
            <span className="text-secondary text-xs uppercase tracking-[0.8em] font-medium mb-6 block">Savoir-Faire</span>
            <h2 className="text-4xl md:text-6xl font-playfair-display font-bold">The Art of <span className="italic text-secondary">Creation</span></h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                title: "Hand-Forged",
                desc: "Every setting is sculpted manually, ensuring the metal flows perfectly with the stone's unique dimensions.",
                icon: "01"
              },
              {
                title: "Rare Sourcing",
                desc: "We traverse the globe to find diamonds and gemstones of exceptional character and ethical origin.",
                icon: "02"
              },
              {
                title: "Micro-Pavé",
                desc: "Thousands of hours go into placing microscopic diamonds with surgical precision under high magnification.",
                icon: "03"
              }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-10 border border-secondary/10 bg-white/5 backdrop-blur-sm group hover:border-secondary/40 transition-all"
              >
                <div className="text-4xl font-playfair-display text-secondary/30 mb-8 group-hover:text-secondary/80 transition-colors">{item.icon}</div>
                <h3 className="text-2xl font-playfair-display font-bold mb-6">{item.title}</h3>
                <p className="text-primary-foreground/60 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-40 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              className="h-px w-full max-w-lg bg-primary/20 mb-20"
            />
            <div className="max-w-4xl text-center">
              <h2 className="text-4xl md:text-7xl font-playfair-display font-bold mb-12 italic text-primary">Ethical Brilliance</h2>
              <p className="text-muted-foreground text-xl md:text-2xl leading-relaxed italic font-light mb-16">
                "Our commitment to quality begins deep within the earth. We only select the top 0.1% of stones that meet our rigorous standards for color, clarity, and character."
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-border pt-16">
                <div className="text-center">
                  <span className="block text-2xl font-bold mb-2">950</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Certified Platinum</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold mb-2">18K</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Sculpted Gold</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold mb-2">D-F</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Color Range</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold mb-2">EX</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Precision Cut</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
