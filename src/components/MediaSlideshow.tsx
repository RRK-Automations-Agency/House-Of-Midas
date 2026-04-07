import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAssetUrl } from "@/lib/utils";

export type SlideshowMediaItem = {
  type: "image" | "video";
  url: string;
  poster?: string;
  title: string;
  subtitle: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  scale?: number;
};

const DEFAULT_MEDIA_ITEMS: SlideshowMediaItem[] = [
  { 
    type: "video", 
    url: getAssetUrl("/images/10ct-video-10.mp4"), 
    poster: getAssetUrl("/images/slideshow/1000128418.png"), 
    title: "Pure Radiance", 
    subtitle: "Diamond Collection",
    objectFit: "cover" as const,
    objectPosition: "center",
    scale: 1
  },
  { 
    type: "image", 
    url: getAssetUrl("/images/products/1000128462.png"), 
    title: "Heritage Craft", 
    subtitle: "Artisanal Excellence",
    objectFit: "cover" as const,
    objectPosition: "center 45%",
    scale: 1
  },
  { 
    type: "image", 
    url: getAssetUrl("/images/slideshow/1000128426.png"), 
    title: "Eternal Sparkle", 
    subtitle: "Signature Pieces",
    objectFit: "cover" as const,
    objectPosition: "center 60%",
    scale: 1
  },
  { 
    type: "image", 
    url: getAssetUrl("/images/products/1000128460.png"), 
    title: "Majestic Aura", 
    subtitle: "Bespoke Luxury",
    objectFit: "cover" as const,
    objectPosition: "center 35%",
    scale: 1
  },
  { 
    type: "image", 
    url: getAssetUrl("/images/slideshow/1000128430.png"), 
    title: "Grandeur Set", 
    subtitle: "Classic Midas",
    objectFit: "cover" as const,
    objectPosition: "center 45%",
    scale: 1
  },
];

type MediaSlideshowProps = {
  items?: SlideshowMediaItem[];
  className?: string;
};

const MediaSlideshow: React.FC<MediaSlideshowProps> = ({ items, className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const safeItems = items && items.length > 0 ? items : DEFAULT_MEDIA_ITEMS;
  const activeItem = safeItems[currentIndex] ?? safeItems[0];

  const next = () => setCurrentIndex((prev) => (prev + 1) % safeItems.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);

  useEffect(() => {
    const delay = activeItem?.type === "video" ? 6000 : 8000;
    const timeout = setTimeout(next, delay);
    return () => clearTimeout(timeout);
  }, [currentIndex, activeItem, safeItems]);

  useEffect(() => {
    if (safeItems.length === 0) return;
    if (currentIndex >= safeItems.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, safeItems]);

  return (
    <section className={`relative h-screen w-full overflow-hidden bg-black flex items-center justify-center ${className || ""}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentIndex}-${activeItem.url}-${activeItem.title}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 h-full w-full"
        >
          {activeItem.type === "video" ? (
            <div className="h-full w-full relative overflow-hidden">
              <video 
                src={activeItem.url} 
                poster={activeItem.poster}
                autoPlay 
                muted 
                playsInline
                style={{ 
                  objectFit: activeItem.objectFit || "cover",
                  objectPosition: activeItem.objectPosition,
                  transform: `scale(${activeItem.scale || 1})`
                }}
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ) : (
            <div className="h-full w-full relative overflow-hidden">
              <img
                  src={activeItem.url}
                  alt={activeItem.title}
                style={{ 
                  objectFit: activeItem.objectFit || "cover",
                  objectPosition: activeItem.objectPosition,
                  transform: `scale(${activeItem.scale || 1})`
                }}
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="mb-4 text-xs font-medium uppercase tracking-[0.5em] text-primary"
            >
              {activeItem.subtitle}
            </motion.span>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-[clamp(2rem,8vw,4.5rem)] font-playfair-display font-bold text-white mb-8 tracking-tighter drop-shadow-2xl leading-none"
            >
              {activeItem.title}
            </motion.h2>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 z-20">
        <button
          onClick={prev}
          className="p-3 border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-all rounded-full"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="p-3 border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/20 transition-all rounded-full"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {safeItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1 transition-all duration-500 ${
              index === currentIndex ? "w-12 bg-primary" : "w-4 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default MediaSlideshow;
