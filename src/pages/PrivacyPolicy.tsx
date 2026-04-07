import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";
import PageMeta from "@/components/common/PageMeta";

const PolicyLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Layout>
    <section 
      className="relative pt-20 sm:pt-[120px] pb-24 sm:pb-[130px] overflow-hidden"
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
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#d4a843] font-medium">Privacy</span>
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

const PrivacyPolicy: React.FC = () => (
  <>
    <PageMeta
      title="Privacy Policy | House of Midas"
      description="Read how House of Midas collects, protects, and uses personal data."
      canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/privacy-policy` : '/privacy-policy'}
    />
    <PolicyLayout title="Privacy Policy">
      <p>Your privacy is of paramount importance to the House of Midas.</p>
      <section>
        <h2 className="text-2xl font-playfair-display font-bold text-[#1a0509] mb-4">Data Collection</h2>
        <p>We collect information only necessary to provide you with the best luxury experience. This includes your contact details for order fulfillment and preferences to personalize our communication.</p>
      </section>
      <section>
        <h2 className="text-2xl font-playfair-display font-bold text-[#1a0509] mb-4">Security</h2>
        <p>We employ state-of-the-art encryption to protect your sensitive data. We never share your personal information with third parties for marketing purposes.</p>
      </section>
    </PolicyLayout>
  </>
);

export default PrivacyPolicy;
