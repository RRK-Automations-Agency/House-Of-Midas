import React from "react";
import { motion } from "motion/react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  inverted?: boolean;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  centered = true,
  inverted = false,
}) => {
  return (
    <div className={`mb-16 md:mb-24 flex flex-col ${centered ? "items-center text-center" : "items-start text-left"}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            "mb-4 md:mb-6 px-4 py-1 border inline-block backdrop-blur-sm",
            inverted ? "border-secondary/50 bg-secondary/15" : "border-primary/40 bg-primary/5"
          )}
        >
          <span className={cn(
            "text-[10px] md:text-xs uppercase tracking-[0.4em] font-bold font-playfair-display",
            inverted ? "text-secondary" : "text-primary"
          )}>
            {badge}
          </span>
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1, duration: 0.8 }}
        className={cn(
          "text-3xl md:text-6xl font-playfair-display font-bold mb-6 md:mb-10 tracking-tight leading-tight",
          inverted ? "text-primary-foreground" : "text-foreground"
        )}
      >
        {title.split(" ").map((word, i) => (
          <span key={i} className={cn("mr-4", i === 1 && (inverted ? "text-secondary italic" : "text-primary italic"))}>
            {word}
          </span>
        ))}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={cn(
            "text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light tracking-wide font-sans italic",
            inverted ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {subtitle}
        </motion.p>
      )}

      <div className={`mt-8 md:mt-10 flex items-center ${centered ? "justify-center" : "justify-start"}`}>
        <div className={cn("w-16 h-px bg-gradient-to-r from-transparent to-transparent", inverted ? "via-secondary/60" : "via-primary/50")} />
        <div className={cn("mx-4 w-1.5 h-1.5 rotate-45 border", inverted ? "border-secondary/60" : "border-primary/50")} />
        <div className={cn("w-16 h-px bg-gradient-to-r from-transparent to-transparent", inverted ? "via-secondary/60" : "via-primary/50")} />
      </div>
    </div>
  );
};

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default SectionHeader;
