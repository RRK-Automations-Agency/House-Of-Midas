import React from "react";
import Layout from "@/components/layouts/Layout";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    category: "General",
    items: [
      { q: "Where is House of Midas based?", a: "We are based in India, with our corporate office in Surat, Gujarat and our manufacturing facility in Kolkata." },
      { q: "Is your jewellery real?", a: "Yes, we use 925 Sterling Silver, 18K/14K Gold, and ethically sourced gemstones including Moissanites and Lab-grown Diamonds." },
      { q: "Do you have a physical store?", a: "Currently, we operate as an online-only brand to ensure we can provide the best value by eliminating middlemen overheads." }
    ]
  },
  {
    category: "Orders & Shipping",
    items: [
      { q: "How long does delivery take?", a: "Most pieces are made-to-order and take 9-12 business days to craft and dispatch. Shipping time depends on your location." },
      { q: "Can I cancel my order?", a: "Cancellations are accepted within 24 hours of placing the order as our pieces are handcrafted specifically for you." },
      { q: "Do you ship internationally?", a: "Yes, we ship to over 50 countries worldwide with fully insured couriers." }
    ]
  },
  {
    category: "Returns & Warranty",
    items: [
      { q: "What is your return policy?", a: "Due to the made-to-order nature of our jewelry, we offer replacements for manufacturing defects but generally do not accept returns." },
      { q: "What does the warranty cover?", a: "Our 2-year warranty covers manufacturing defects, professional cleaning, and replacement of lost accent diamonds." }
    ]
  }
];

const FAQ: React.FC = () => {
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
              <span className="text-xs uppercase tracking-[0.5em] text-[var(--midas-gold)] mb-4 block font-medium">Assistance Center</span>
              <h1 className="text-5xl md:text-7xl font-playfair-display font-bold text-[#1a0509] mb-8">
                How Can We <span className="text-[var(--midas-gold)] italic">Help?</span>
              </h1>
            </motion.div>

            <div className="space-y-16">
              {FAQS.map((group, idx) => (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <h2 className="text-2xl font-playfair-display font-bold mb-8 border-b border-[#1a0509]/10 pb-4 text-[var(--midas-gold)]">
                    {group.category}
                  </h2>
                  <Accordion type="single" collapsible className="w-full">
                    {group.items.map((item, i) => (
                      <AccordionItem key={i} value={`item-${idx}-${i}`} className="border-[#1a0509]/10">
                        <AccordionTrigger className="text-left font-playfair-display text-lg text-[#1a0509] hover:text-[var(--midas-gold)] transition-colors py-6">
                          {item.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-[#1a0509]/70 leading-relaxed italic pb-6 text-base">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>

            <div className="mt-24 p-12 bg-white border border-[#1a0509]/10 text-center relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,134,11,0.03)_0%,transparent_70%)] pointer-events-none" />
              <h3 className="text-2xl font-playfair-display font-bold text-[#1a0509] mb-4">Still have questions?</h3>
              <p className="text-[#1a0509]/70 mb-8 italic">Our concierge team is available 24/7 to assist you with any inquiries.</p>
              <Link to="/contact">
                <button className="px-12 py-4 bg-[#1a0509] text-white uppercase tracking-widest text-xs font-bold hover:bg-[var(--midas-gold)] transition-all shadow-lg shadow-[#1a0509]/10">
                  Contact Concierge
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQ;
