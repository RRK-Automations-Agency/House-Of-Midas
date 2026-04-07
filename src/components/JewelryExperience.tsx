import React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, MotionValue } from "motion/react";
import { Button } from "@/components/ui/button";


interface JewelryExperienceProps {
  scrollYProgress: MotionValue<number>;
}

const JewelryExperience: React.FC<JewelryExperienceProps> = ({ scrollYProgress }) => {
  const [activeStage, setActiveStage] = React.useState<1 | 2 | 3>(1);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const transition = { type: "spring" as const, stiffness: 85, damping: 22, mass: 0.9 };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setActiveStage((prev) => {
      let nextStage: 1 | 2 | 3 = prev;

      // Hysteresis thresholds prevent abrupt snapping around cut points.
      if (prev === 1 && latest > 0.4) nextStage = 2;
      else if (prev === 2 && latest < 0.28) nextStage = 1;
      else if (prev === 2 && latest > 0.74) nextStage = 3;
      else if (prev === 3 && latest < 0.6) nextStage = 2;

      if (prev === nextStage) return prev;
      setDirection(nextStage > prev ? 1 : -1);
      return nextStage;
    });
  });

  return (
    <div className="absolute inset-0 z-10 pointer-events-none container mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center">
      <AnimatePresence initial={false} mode="sync">
      {activeStage === 1 && (
      <motion.div
        key="stage-1"
        initial={{ opacity: 0, y: direction > 0 ? 34 : -34 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: direction > 0 ? -34 : 34 }}
        transition={transition}
        className="absolute inset-0 flex flex-col items-center justify-start px-4 pt-[12vh] md:pt-[15vh] pb-[8vh]"
      >

        <div className="w-full h-full relative flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="mb-8 md:mb-10 px-8 py-2 inline-block z-20"
            aria-hidden="true"
          >
            <span className="text-sm md:text-base uppercase tracking-[0.4em] text-transparent select-none">
              {"\u00A0"}
            </span>
          </motion.div>

          {/* Left Text */}
          <div className="absolute top-[42%] lg:top-[48%] left-0 md:left-4 lg:left-12 xl:left-24 transform -translate-y-1/2 text-left z-10 hidden xl:block">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[5rem] font-playfair-display font-bold text-primary-foreground mb-4 tracking-tight leading-[1.1]">
              THE <br/><span className="text-secondary italic">CELESTIAL</span>
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-primary-foreground/85 max-w-[180px] md:max-w-[220px] lg:max-w-[280px] leading-relaxed font-light tracking-wide uppercase">
              A masterpiece of light and fire,
            </p>
          </div>

          {/* Right Text */}
          <div className="absolute top-[42%] lg:top-[48%] right-0 md:right-4 lg:right-12 xl:right-24 transform -translate-y-1/2 text-right z-10 flex flex-col items-end hidden xl:flex">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[5rem] font-playfair-display font-bold text-primary-foreground mb-4 tracking-tight leading-[1.1]">
              OVAL <br/>DIAMOND
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-primary-foreground/85 max-w-[180px] md:max-w-[220px] lg:max-w-[280px] leading-relaxed font-light tracking-wide uppercase">
              meticulously handcrafted for the eternal few.
            </p>
          </div>
          
          {/* Mobile/Tablet Text (Fallback for smaller screens) */}
          <div className="xl:hidden absolute top-[2%] flex flex-col items-center text-center z-10 w-full px-4">
            <h1 className="text-4xl sm:text-5xl font-playfair-display font-bold text-primary-foreground mb-4 tracking-tight leading-[1.1]">
              THE <span className="text-secondary italic">CELESTIAL</span><br/>OVAL DIAMOND
            </h1>
            {/* The subtext now sits lower on the screen to appear below the ring */}
            <p className="absolute top-[60vh] text-[11px] sm:text-sm text-primary-foreground/85 max-w-[300px] sm:max-w-[400px] leading-relaxed font-light tracking-wide uppercase">
              A masterpiece of light and fire,<br/>meticulously handcrafted for the eternal few.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-3 md:space-y-0 md:space-x-8 pointer-events-auto absolute bottom-[-10%] md:-bottom-8 z-20 w-full px-8 text-center pb-8 md:pb-0">
            <Button
              variant="default"
              size="lg"
              onClick={() => {
                document.getElementById('product-details')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full md:w-auto px-6 md:px-10 h-10 md:h-14 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold transition-all hover:scale-105 bg-secondary text-foreground hover:bg-secondary/90"
            >
              DISCOVER THE PIECE
            </Button>
            <Link to="/collections">
              <Button
                variant="outline"
                size="lg"
                className="w-full md:w-auto px-6 md:px-10 h-10 md:h-14 uppercase tracking-[0.2em] text-[10px] md:text-xs font-bold border-secondary text-secondary transition-all hover:scale-105 hover:bg-secondary/10"
              >
                THE COLLECTION
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
      )}

      {activeStage === 2 && (
      <motion.div
        key="stage-2"
        initial={{ opacity: 0, y: direction > 0 ? 34 : -34 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: direction > 0 ? -34 : 34 }}
        transition={transition}
        className="absolute inset-0 z-10 w-full h-full flex items-center justify-center"
      >
        {/* Left Text */}
        <div className="absolute top-[42%] lg:top-[48%] left-0 md:left-4 lg:left-12 xl:left-24 transform -translate-y-1/2 text-left hidden xl:block">
          <h2 className="text-sm md:text-base uppercase tracking-[0.6em] text-secondary mb-4">Artisanship</h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair-display font-medium text-primary-foreground mb-6">
            ETERNAL <br/><span className="italic text-secondary">CRAFT</span>
          </h1>
        </div>

        {/* Right Details */}
        <div className="absolute top-[42%] lg:top-[48%] right-0 md:right-4 lg:right-12 xl:right-24 transform -translate-y-1/2 flex flex-col items-end text-right hidden xl:flex">
          <div className="mb-6 flex flex-col items-end border-r border-secondary/50 pr-6">
            <span className="block text-[10px] uppercase tracking-widest text-secondary mb-2">Setting</span>
            <span className="text-sm text-primary-foreground/80 uppercase tracking-wider">Hand-forged Platinum</span>
          </div>
          <div className="flex flex-col items-end border-r border-secondary/50 pr-6">
            <span className="block text-[10px] uppercase tracking-widest text-secondary mb-2">Technique</span>
            <span className="text-sm text-primary-foreground/80 uppercase tracking-wider">Heritage Micro-Pave</span>
          </div>
        </div>

        {/* Mobile/Tablet Text (Fallback) */}
        <div className="xl:hidden absolute top-[8%] flex flex-col items-center text-center w-full px-4 pt-10">
          <h2 className="text-sm uppercase tracking-[0.6em] text-secondary mb-3">Artisanship</h2>
          <h1 className="text-4xl sm:text-5xl font-playfair-display font-medium text-primary-foreground mb-8">
            ETERNAL <span className="italic text-secondary">CRAFT</span>
          </h1>
          <div className="flex items-center justify-center space-x-12 absolute top-[72vh] xl:static w-full">
            <div className="text-center">
              <span className="block text-[10px] uppercase tracking-widest text-secondary mb-2">Setting</span>
              <span className="text-sm sm:text-base text-primary-foreground/80 uppercase tracking-wider">Platinum</span>
            </div>
            <div className="text-center">
              <span className="block text-[10px] uppercase tracking-widest text-secondary mb-2">Technique</span>
              <span className="text-sm sm:text-base text-primary-foreground/80 uppercase tracking-wider">Micro-Pave</span>
            </div>
          </div>
        </div>
      </motion.div>
      )}

      {activeStage === 3 && (
      <motion.div
        key="stage-3"
        initial={{ opacity: 0, y: direction > 0 ? 34 : -34 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: direction > 0 ? -34 : 34 }}
        transition={transition}
        className="absolute inset-0 z-10 w-full h-full flex items-center justify-center"
      >
        {/* Left Text */}
        <div className="absolute top-[42%] lg:top-[48%] left-0 md:left-4 lg:left-12 xl:left-24 transform -translate-y-1/2 text-left hidden xl:block">
          <h2 className="text-sm md:text-base uppercase tracking-[0.6em] text-secondary mb-4">Gemology</h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair-display font-medium text-primary-foreground mb-6">
            PURE <br/><span className="italic text-secondary">BRILLIANCE</span>
          </h1>
        </div>

        {/* Right Details */}
        <div className="absolute top-[42%] lg:top-[48%] right-0 md:right-4 lg:right-12 xl:right-24 transform -translate-y-1/2 flex flex-col items-end text-right hidden xl:flex">
          <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-right w-fit">
            <div className="border-b border-secondary/30 pb-2">
              <span className="block text-[8px] uppercase tracking-tighter text-secondary">Weight</span>
              <span className="text-base font-playfair-display text-primary-foreground">10.5 Carats</span>
            </div>
            <div className="border-b border-secondary/30 pb-2">
              <span className="block text-[8px] uppercase tracking-tighter text-secondary">Clarity</span>
              <span className="text-base font-playfair-display text-primary-foreground">Flawless (FL)</span>
            </div>
            <div className="border-b border-secondary/30 pb-2">
              <span className="block text-[8px] uppercase tracking-tighter text-secondary">Cut</span>
              <span className="text-base font-playfair-display text-primary-foreground">Oval Brilliant</span>
            </div>
            <div className="border-b border-secondary/30 pb-2">
              <span className="block text-[8px] uppercase tracking-tighter text-secondary">Color</span>
              <span className="text-base font-playfair-display text-primary-foreground">D (Pure White)</span>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Text (Fallback) */}
        <div className="xl:hidden absolute top-[10%] flex flex-col items-center text-center w-full px-4 pt-10">
          <h2 className="text-sm uppercase tracking-[0.6em] text-secondary mb-3">Gemology</h2>
          <h1 className="text-4xl sm:text-5xl font-playfair-display font-medium text-primary-foreground mb-8">
            PURE <span className="italic text-secondary">BRILLIANCE</span>
          </h1>
          <div className="grid grid-cols-2 gap-8 text-center w-full max-w-[320px] absolute top-[65vh] xl:static">
            <div>
              <span className="block text-[10px] uppercase tracking-tighter text-secondary mb-1">Weight</span>
              <span className="text-sm sm:text-base font-playfair-display text-primary-foreground">10.5 Carats</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-tighter text-secondary mb-1">Clarity</span>
              <span className="text-sm sm:text-base font-playfair-display text-primary-foreground">Flawless (FL)</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-tighter text-secondary mb-1">Cut</span>
              <span className="text-sm sm:text-base font-playfair-display text-primary-foreground">Oval Brilliant</span>
            </div>
            <div>
              <span className="block text-[10px] uppercase tracking-tighter text-secondary mb-1">Color</span>
              <span className="text-sm sm:text-base font-playfair-display text-primary-foreground">D (Pure White)</span>
            </div>
          </div>
        </div>
      </motion.div>
      )}
      </AnimatePresence>

    </div>
  );
};

export default JewelryExperience;
