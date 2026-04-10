import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/shopify-cart";
import { motion } from "motion/react";

interface ShowcaseProps {
  products?: Product[];
}

const Showcase: React.FC<ShowcaseProps> = ({ products }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const targetScrollX = useRef(0);
  const currentScrollX = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const isAnimating = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const featuredProducts = (products ?? []).slice(0, 9);

  // Layout effects for horizontal scroll removed

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    onResize();
    window.addEventListener("resize", onResize);

    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const animate = () => {
      if (!isAnimating.current || !scrollContainer) return;

      // Smoothing factor (lower = silkier/slower, higher = snappier)
      const lerpFactor = 0.08;
      const diff = targetScrollX.current - currentScrollX.current;
      
      if (Math.abs(diff) > 0.1) {
        currentScrollX.current += diff * lerpFactor;
        scrollContainer.scrollLeft = currentScrollX.current;
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        currentScrollX.current = targetScrollX.current;
        scrollContainer.scrollLeft = currentScrollX.current;
        isAnimating.current = false;
        animationFrameId.current = null;
        // Restore snap behavior once animation completes
        scrollContainer.style.scrollSnapType = 'x proximity';
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Only horizontal scroll on desktop/large tablets
      if (window.innerWidth < 768) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const maxScroll = scrollWidth - clientWidth;
      
      // Determine boundaries with a pixel of buffer
      const isAtLeft = scrollLeft <= 2;
      const isAtRight = scrollLeft + clientWidth >= scrollWidth - 5;

      const isScrollingDown = e.deltaY > 0;
      const isScrollingUp = e.deltaY < 0;

      // Only hijack if we have room to move horizontally in that direction
      const canMoveRight = isScrollingDown && !isAtRight;
      const canMoveLeft = isScrollingUp && !isAtLeft;

      if (canMoveRight || canMoveLeft) {
        e.preventDefault();
        
        // Multiplier to translate vertical scroll to horizontal 'strength'
        // This value scales naturally with deltaY (scroll speed)
        const multiplier = 0.8;
        
        // Disable snapping while we are manually controlling the position to prevent jitters
        scrollContainer.style.scrollSnapType = 'none';

        // Update target based on user input speed
        targetScrollX.current = Math.min(Math.max(0, targetScrollX.current + (e.deltaY * multiplier)), maxScroll);
        
        if (!isAnimating.current) {
          isAnimating.current = true;
          // Sync current position with actual scroll in case user used native methods
          currentScrollX.current = scrollContainer.scrollLeft;
          animationFrameId.current = requestAnimationFrame(animate);
        }
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("resize", onResize);
      scrollContainer.removeEventListener("wheel", handleWheel);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  // Scroll-based transformations removed as we transitioned to a vertical grid

  return (
    <>
      <section
        ref={sectionRef}
        className="relative pt-12 sm:pt-16 pb-12 sm:pb-20 bg-[#fdf8f2]"
      >
        <div
          className="relative px-5 md:px-10 lg:px-16"
          style={{
            background: `linear-gradient(180deg, #fdf8f2 0%, #f5ead8 50%, #fdf8f2 100%)`,
          }}
        >

          {/* Header block */}
          <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-10 pt-[42px] md:pt-[56px]">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="text-center"
            >
              <div className="flex flex-col items-center relative mb-8 sm:mb-12 lg:mb-16">
                <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="h-px w-10 sm:w-16 md:w-24 bg-gradient-to-r from-transparent via-gold-400 to-gold-500" />
                  <span className="text-[10px] sm:text-xs tracking-[0.4em] text-secondary font-cinzel uppercase font-medium">Unique Masterpieces</span>
                  <div className="h-px w-10 sm:w-16 md:w-24 bg-gradient-to-l from-transparent via-gold-400 to-gold-500" />
                </div>
                
                <div className="relative inline-block text-center mb-10 sm:mb-16 md:mb-20">
                  <h2 className="m-0 flex flex-col items-center leading-none gap-0">
                    <span className="font-great-vibes text-[clamp(40px,9vw,110px)] font-normal text-secondary block -mb-2 opacity-95 leading-none">
                      Featured
                    </span>

                    <div className="flex items-baseline gap-2 sm:gap-4 md:gap-6 mt-1 sm:mt-2">
                      <span
                        className="font-playfair-display text-[clamp(40px,9vw,118px)] font-bold italic block leading-[0.85] tracking-[-0.01em]"
                        style={{
                          color: "#5c0d1a",
                        }}
                      >
                        Collection
                      </span>

                      <span className="font-great-vibes text-[clamp(1.5rem,4vw,2.5rem)] font-normal text-secondary block opacity-90">
                        For You
                      </span>
                    </div>
                  </h2>
                  <div className="w-[80px] h-[2px] bg-gradient-to-r from-transparent via-gold-300 to-transparent mx-auto mt-6 sm:mt-8" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Horizontal Gallery Track */}
          <div className="max-w-[1400px] mx-auto mt-6 sm:mt-10 lg:mt-16">
              <div 
                ref={scrollRef}
                className="overflow-x-auto hide-scrollbar touch-pan-x px-4 sm:px-10 snap-x snap-proximity pb-4 overscroll-behavior-x-contain"
              >
                <div className="flex gap-4 sm:gap-6 lg:gap-8 items-stretch w-max pr-10">
                  {featuredProducts.map((product, idx) => {
                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.6, delay: isMobile ? 0 : idx * 0.1 }}
                        className="flex-shrink-0 w-[240px] sm:w-[320px] md:w-[360px] lg:w-[400px] snap-center"
                      >
                        <ProductCard product={product} enableHoverSwap />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA - Separate static section to ensure it doesn't move with the scroll */}
  <section className="relative z-[10] py-8 sm:py-12 bg-[#fdf8f2]">
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="text-center"
          >
            <Link
              to="/collections?category=Rings"
              className="inline-block px-[52px] py-[16px] bg-[#1a0509] border border-[#1a0509] text-[#f0cc6e] font-jost text-[10px] font-medium tracking-[0.45em] uppercase no-underline transition-colors duration-400 relative overflow-hidden group hover:text-[#1a0509]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#5c0d1a] to-gold-300 scale-x-0 origin-left transition-transform duration-[450ms] cubic-bezier-[0.25,0.46,0.45,0.94] z-0 group-hover:scale-x-100" />
              <span className="relative z-10">View Full Collection</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Showcase;