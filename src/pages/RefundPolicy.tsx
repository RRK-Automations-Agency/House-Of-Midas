import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";
import PageMeta from "@/components/common/PageMeta";

const PolicyLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Layout>
    <section 
      className="relative pt-6 sm:pt-8 pb-24 sm:pb-[130px] overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 800px 500px at 90% 20%, rgba(92,13,26,0.06) 0%, transparent 60%),
          radial-gradient(ellipse 600px 400px at 5%  85%, rgba(184,134,11,0.07) 0%, transparent 55%),
          linear-gradient(180deg, #fdf8f2 0%, #f5ead8 50%, #fdf8f2 100%)
        `
      }}
    >
      <div className="container mx-auto px-6 sm:px-12 relative z-10">
        <div className="max-w-[1000px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 sm:mb-16 border-b border-[#1a0509]/10 pb-8 sm:pb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-[1px] bg-[#d4a843]/40" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#d4a843] font-medium">Agreement</span>
            </div>
            <h1 className="font-playfair-display text-[clamp(2.5rem,5vw,5.5rem)] font-bold italic leading-none text-[#1a0509]">
              {title}
            </h1>
          </motion.div>
          <div className="font-cormorant text-[19px] italic leading-[1.8] text-[#1a0509]/90 space-y-12">
            {children}
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

const RefundPolicy: React.FC = () => (
  <>
    <PageMeta
      title="Refund Policy | House of Midas"
      description="Understand House of Midas replacement, cancellation, and refund conditions before purchase."
      canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/refund-policy` : '/refund-policy'}
    />
    <PolicyLayout title="Refund Policy">
      <p>Last updated: July 2023</p>
      <section className="space-y-4">
        <h2 className="text-2xl font-playfair-display font-bold italic text-[#1a0509] mb-6">Replacements & Cancellations</h2>
        <p>Every piece at House of Midas is handcrafted specifically for you upon order. Because of this personalized craftsmanship, we generally do not accept returns for refunds.</p>
        <p>However, we offer a seamless <strong className="text-[#d4a843]">Replacement Policy</strong> if your jewelry arrives with a manufacturing defect or is damaged during transit. Please notify our concierge within 48 hours of delivery.</p>
      </section>
      <section>
        <h2 className="text-2xl font-playfair-display font-bold text-[#1a0509] mb-4">Cancellations</h2>
        <p>You may cancel your order within 24 hours of placement for a full refund. Once the crafting process has begun, we are unable to cancel or refund the order.</p>
      </section>
    </PolicyLayout>
  </>
);

export default RefundPolicy;
