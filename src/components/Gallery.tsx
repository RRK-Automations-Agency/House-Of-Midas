import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { HERO_IMAGES } from "@/constants";

const HIGHLIGHTS = [
  { label: "Carat Weight", value: "8.2ct", detail: "Exceptional Mass" },
  { label: "Cut Grade", value: "Oval Brilliant", detail: "Optimal Fire" },
  { label: "Clarity", value: "IF Flawless", detail: "Pure Soul" },
  { label: "Origin", value: "Ethical Gold", detail: "Vested Legacy" },
];

const Gallery: React.FC = () => {
  const [activeImage, setActiveImage] = useState(HERO_IMAGES[0]);

  return (
    <section 
      className="relative pt-[110px] pb-[130px] overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 800px 500px at 90% 20%, rgba(92,13,26,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 600px 400px at 5% 85%, rgba(184,134,11,0.07) 0%, transparent 55%),
          linear-gradient(180deg, #fdf8f2 0%, #f5ead8 50%, #fdf8f2 100%)
        `
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E\")" }}></div>

      <div className="max-w-[1200px] mx-auto px-10 relative z-10">
        
        {/* Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.12 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-6">
            <div className="flex-1 max-w-[90px] h-[1px] bg-gradient-to-r from-transparent to-secondary" />
            <span className="block font-great-vibes text-[clamp(44px,6.5vw,84px)] font-normal text-secondary leading-none -mb-1 opacity-90">
              Product
            </span>
            <div className="flex-1 max-w-[90px] h-[1px] bg-gradient-to-l from-transparent to-secondary" />
          </div>
          <span 
            className="block font-playfair-display text-[clamp(58px,9vw,118px)] font-bold italic leading-[0.88] tracking-[-0.01em] mt-0"
            style={{
              color: "#5c0d1a",
              filter: "drop-shadow(0 2px 18px rgba(212,168,67,0.18))"
            }}
          >
            Details
          </span>
          <span className="block w-[80px] h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto mt-[22px] opacity-90" />
        </motion.div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] lg:grid-cols-[80px_1fr_1fr] md:gap-8 lg:gap-10 items-start gap-6">
          
          {/* Thumbnails */}
          <motion.div 
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.12 }}
            className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-hidden hide-scrollbar"
          >
            {HERO_IMAGES.slice(0, 4).map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-[78px] md:w-[80px] h-[80px] overflow-hidden cursor-pointer border shrink-0 transition-all duration-300 group
                  ${activeImage === img ? "opacity-100 border-secondary" : "opacity-62 border-transparent hover:opacity-100 hover:border-secondary/40"}`}
              >
                <img 
                  src={img} 
                  alt={`View ${idx + 1}`} 
                  className="w-full h-full object-cover block transition-transform duration-400 group-hover:scale-[1.06]"
                  style={
                    idx === 1 ? { filter: "brightness(1.06) contrast(1.06)" } :
                    idx === 2 ? { filter: "sepia(0.14) brightness(1.04)" } :
                    idx === 3 ? { filter: "brightness(0.94) saturate(1.12)" } : {}
                  }
                />
              </div>
            ))}
          </motion.div>

          {/* Main image */}
          <motion.div 
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.12 }}
            className="relative overflow-hidden bg-[#ede0cc] h-[344px] md:h-[450px] lg:h-[344px] xl:h-[400px] group block"
          >
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                src={activeImage}
                alt="Product main view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full block object-cover transition-transform duration-700 cubic-bezier-[0.25,0.46,0.45,0.94] group-hover:scale-[1.04]"
              />
            </AnimatePresence>
            <div className="absolute top-[-8px] left-[-8px] w-[40px] h-[40px] border-t border-l border-secondary z-10 opacity-60 pointer-events-none transition-all duration-400 group-hover:w-[60px] group-hover:h-[60px] group-hover:opacity-100" />
            <div className="absolute bottom-[-8px] right-[-8px] w-[40px] h-[40px] border-b border-r border-secondary z-10 opacity-60 pointer-events-none transition-all duration-400 group-hover:w-[60px] group-hover:h-[60px] group-hover:opacity-100" />
          </motion.div>

          {/* Info */}
          <motion.div 
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.24 }}
            className="pt-1 md:pt-0 md:col-start-2 lg:col-start-3"
          >
            <h2 className="font-playfair-display text-[clamp(20px,2.4vw,30px)] font-normal leading-[1.3] text-[#1a0509] m-0 mb-[14px]">
              Crafted for the <em 
                className="font-bold italic"
                style={{
                  background: "linear-gradient(135deg, var(--midas-gold) 0%, #f0cc6e 45%, #c97b5a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >Eternal Few</em>
            </h2>
            <p className="font-cormorant text-[17px] italic font-normal leading-[1.85] text-[#1a0509] m-0 mb-[22px] pb-[18px] border-b border-[rgba(26,5,9,0.1)] opacity-90">
              A masterpiece of light and fire, meticulously handcrafted to capture the essence of celestial radiance. This piece features a rare oval-cut diamond of incomparable clarity, nestled within a hand-forged gold setting that whispers of heritage and artisanal soul.
            </p>

            <div className="grid grid-cols-2 mb-[26px]">
              {HIGHLIGHTS.map((item, index) => (
                <div 
                  key={index}
                  className={`py-[12px] border-b border-[rgba(26,5,9,0.1)] ${
                    index % 2 === 0 
                      ? "pr-[16px] border-r border-[rgba(26,5,9,0.1)]" 
                      : "pl-[16px]"
                  }`}
                >
                  <div className="font-jost text-[11px] font-bold tracking-[0.3em] uppercase text-secondary mb-[6px]">
                    {item.label}
                  </div>
                  <div className="font-jost text-[22px] font-bold text-[#1a0509] leading-tight mb-[4px]">
                    {item.value}
                  </div>
                  <div 
                    className="font-jost text-[10px] font-semibold tracking-[0.2em] uppercase"
                    style={{
                      background: "linear-gradient(90deg, var(--midas-gold), #8B7330)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>

            <Link 
              to="/contact" 
              className="block w-[100%] md:w-[100%] lg:w-auto px-[40px] py-[18px] text-center font-jost text-[12px] font-bold tracking-[0.45em] uppercase no-underline bg-[#1a0509] text-[#f0cc6e] relative overflow-hidden transition-colors duration-400 group hover:text-[#1a0509] shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#5c0d1a] to-[#d4a843] scale-x-0 origin-left transition-transform duration-[450ms] cubic-bezier-[0.25,0.46,0.45,0.94] z-0 group-hover:scale-x-100" />
              <span className="relative z-10">Inquire for Private View</span>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Gallery;
