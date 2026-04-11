import React, { useState, useEffect } from 'react';
import Layout from '@/components/layouts/Layout';
import ProductCard from '@/components/ProductCard';
import { getWishlistItems, toggleWishlistItem, type WishlistItem } from '@/lib/wishlist';
import { Loader2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import PageMeta from '@/components/common/PageMeta';

const SHOPIFY_HANDLE_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

function normalizeHandle(value: string | undefined): string {
  return String(value ?? '').trim().toLowerCase();
}

function isValidShopifyHandle(handle: string): boolean {
  return SHOPIFY_HANDLE_PATTERN.test(handle);
}

function itemKey(item: WishlistItem): string {
  return String(item.handle || item.id || '').trim();
}

const Wishlist: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlistProducts = async () => {
    try {
      const { items } = await getWishlistItems();

      const staleKeys = new Set<string>();
      const validItems = items.filter((item) => {
        const normalized = normalizeHandle(item.handle);
        if (!normalized || !isValidShopifyHandle(normalized)) {
          const key = itemKey(item);
          if (key) staleKeys.add(key);
          return false;
        }
        return true;
      });

      const pruneItems = async () => {
        if (staleKeys.size === 0) return;
        await Promise.allSettled(
          items
            .filter((item) => staleKeys.has(itemKey(item)))
            .map((item) => {
              const id = String(item.id || item.handle || '').trim();
              const handle = normalizeHandle(item.handle);
              if (!id && !handle) return Promise.resolve();
              return toggleWishlistItem(id, handle, true);
            })
        );
      };
      
      if (validItems.length === 0) {
        await pruneItems();
        setProducts([]);
        setLoading(false);
        return;
      }

      // Fetch each product by handle from Shopify AJAX API
      const productPromises = validItems.map(async (item) => {
        const handle = normalizeHandle(item.handle);
        try {
          const res = await fetch(`/products/${handle}.js`);
          if (!res.ok) {
            if (res.status === 404) {
              const key = itemKey(item);
              if (key) staleKeys.add(key);
            }
            return null;
          }
          const data = await res.json();

          // Map Shopify AJAX format to our ProductCard format
          return {
            id: String(data.variants[0].id),
            shopifyId: String(data.id),
            name: data.title,
            handle: data.handle,
            category: data.type || 'Jewellery',
            price: `£${(data.price / 100).toLocaleString('en-GB')}`,
            comparePrice: data.compare_at_price ? `£${(data.compare_at_price / 100).toLocaleString('en-GB')}` : undefined,
            description: data.description,
            image: data.featured_image,
            hoverImage: data.images.length > 1 ? data.images[1] : data.featured_image,
          };
        } catch (e) {
          return null;
        }
      });

      const results = await Promise.all(productPromises);
      setProducts(results.filter(p => p !== null));

      await pruneItems();
    } catch (err) {
      console.error('Failed to load wishlist:', err);
      toast.error("Could not sync some treasures", {
        description: "We are displaying your locally saved selection."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistProducts();
    
    // Listen for updates from ProductCards
    const handleUpdate = () => fetchWishlistProducts();
    window.addEventListener('wishlist-updated', handleUpdate);
    return () => window.removeEventListener('wishlist-updated', handleUpdate);
  }, []);

  return (
    <Layout>
      <PageMeta
        title="Wishlist | House of Midas"
        description="Review and manage your saved House of Midas pieces before checkout."
        canonicalUrl={typeof window !== 'undefined' ? `${window.location.origin}/wishlist` : '/wishlist'}
      />
      <div 
        className="min-h-[80vh] pt-6 pb-20 px-6 md:px-12"
        style={{
          background: `
            radial-gradient(ellipse 800px 500px at 90% 20%, rgba(92,13,26,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 600px 400px at 5% 85%, rgba(184,134,11,0.05) 0%, transparent 55%),
            linear-gradient(180deg, #fdf8f2 0%, #f5ead8 50%, #fdf8f2 100%)
          `
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#1a0509]/10 pb-10">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[#6B5820]"
              >
                <div className="w-8 h-[1px] bg-[#6B5820]/40" />
                Your Treasury
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-playfair-display text-5xl md:text-7xl font-bold text-[#1a0509] leading-tight"
              >
                Your <span className="italic font-normal">Desires</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="font-jost text-sm tracking-[0.2em] uppercase text-[#1a0509]/60"
              >
                A curated collection of pieces that speak to your soul
              </motion.p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 mt-8 md:mt-0">
               <button 
                onClick={() => fetchWishlistProducts()}
                className="font-jost text-[10px] uppercase tracking-[0.3em] text-[#1a0509]/40 hover:text-[#1a0509] transition-colors"
                disabled={loading}
              >
                {loading ? "Syncing..." : "Refresh Treasury"}
              </button>

              <Link 
                to="/collections" 
                className="group flex items-center gap-4 font-jost text-[12px] uppercase tracking-[0.3em] text-[#1a0509] hover:text-[#d4a843] transition-all"
              >
                Discover More
                <div className="w-10 h-[1px] bg-[#1a0509]/20 group-hover:w-16 group-hover:bg-[#d4a843] transition-all duration-500" />
              </Link>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <Loader2 className="w-12 h-12 animate-spin text-[#d4a843]" />
              <p className="font-playfair-display italic text-xl text-[#1a0509]/40">Recalling your treasures...</p>
            </div>
          ) : products.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
            >
              <AnimatePresence mode="popLayout">
                {products.map((item) => (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProductCard product={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 rounded-[40px] border border-dashed border-[#1a0509]/10 bg-white/30 backdrop-blur-sm"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-[#1a0509]/5">
                <Heart className="w-10 h-10 text-[#d4a843]/30" strokeWidth={1} />
              </div>
              <h2 className="font-playfair-display text-3xl font-bold text-[#1a0509] mb-4">Your treasury is empty</h2>
              <p className="font-jost text-[#1a0509]/50 mb-10 max-w-sm mx-auto leading-relaxed">
                The path to elegance begins with a single choice. Explore our collections and save the pieces that move you.
              </p>
              <Link 
                to="/collections" 
                className="inline-block bg-[#1a0509] text-[#f0cc6e] font-jost px-12 py-5 rounded-full text-[11px] uppercase tracking-[0.4em] font-bold transition-all duration-500 hover:bg-[#d4a843] hover:text-white hover:shadow-2xl hover:translate-y-[-4px]"
              >
                Begin Exploration
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
