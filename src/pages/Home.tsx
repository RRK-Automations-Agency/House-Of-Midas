import React, { useRef } from "react";

import Layout from "@/components/layouts/Layout";
import Showcase from "@/components/Showcase";
import JewelryScrollCanvas from "@/components/JewelryScrollCanvas";
import JewelryExperience from "@/components/JewelryExperience";
import Heritage from "@/components/Heritage";
import Gallery from "@/components/Gallery";
import MediaSlideshow from "@/components/MediaSlideshow";
import Testimonials from "@/components/Testimonials";
import { useScroll } from "motion/react";
import { Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import PageMeta from "@/components/common/PageMeta";

const Home: React.FC = () => {
  const { products, loading } = useProducts();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Only use live Shopify products — no static fallback
  const allProducts = products;

  // Filter products by tag for dynamic layout control
  const { featuredProducts, slideshowItems } = React.useMemo(() => {
    const featured = allProducts.filter(p => p.tags?.includes('featured'));
    const slideshow = allProducts.filter(p => p.tags?.includes('slideshow'));
    
    // Convert slideshow products to slideshow items
    const slideshowItems = slideshow.map(p => ({
      type: "image" as const,
      url: p.image,
      title: p.name || "House of Midas",
      subtitle: p.category || "Fine Jewellery",
      objectFit: "cover" as const,
      objectPosition: "center",
      scale: 1.05
    }));

    return {
      featuredProducts: featured.length > 0 ? featured : allProducts.slice(0, 8),
      slideshowItems: slideshowItems
    };
  }, [allProducts]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/` : '/';

  return (
    <Layout>
      <PageMeta
        title="House of Midas | Fine Jewellery"
        description="Explore handcrafted luxury jewellery by House of Midas, including rings, necklaces, earrings, bangles, and bracelets."
        canonicalUrl={canonicalUrl}
        ogTitle="House of Midas | Fine Jewellery"
        ogDescription="Discover House of Midas collections crafted for timeless elegance."
      />
      {/* 1. Hero Section */}
      <section ref={containerRef} className="relative h-[600vh] bg-[hsl(var(--foreground))]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <JewelryScrollCanvas scrollYProgress={scrollYProgress} />
          <JewelryExperience scrollYProgress={scrollYProgress} />
        </div>
      </section>

      {/* 2. Featured Collection */}
      <section id="showcase-section">
        {loading && products.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center bg-[#fdf8f2]">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--midas-gold)]" />
          </div>
        ) : (
          <Showcase products={featuredProducts} />
        )}
      </section>

      {/* 3. Slide Show (Images + Video) */}
      <MediaSlideshow items={slideshowItems} />

      {/* 4. Product Details */}
      <section id="product-details">
        <Gallery />
      </section>

      {/* 5. Heritage Section */}
      <Heritage />



      {/* 7. Customer Feedback */}
      <Testimonials />
    </Layout>
  );
};

export default Home;
