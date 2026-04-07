import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layouts/Layout";
import { useProducts } from "@/hooks/useProducts";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Heart,
  Share2,
  Loader2,
  Plus,
  Minus,
  Check,
  Play,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { addToCart, getProductByHandle } from "@/lib/shopify-cart";
import { getWishlistItems, toggleWishlistItem } from "@/lib/wishlist";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";
import Lightbox from "@/components/ui/Lightbox";
import PageMeta from "@/components/common/PageMeta";

const KNOWN_METALS = ["Yellow Gold", "Rose Gold", "White Gold", "Platinum", "Silver", "Gold"];

function normalizeMetalName(value: string): string | null {
  const lower = value.toLowerCase();
  if (lower.includes("yellow") && lower.includes("gold")) return "Yellow Gold";
  if (lower.includes("rose") && lower.includes("gold")) return "Rose Gold";
  if (lower.includes("white") && lower.includes("gold")) return "White Gold";
  if (lower.includes("platinum")) return "Platinum";
  if (lower.includes("silver")) return "Silver";
  if (lower === "gold" || (lower.includes("gold") && !lower.includes("yellow") && !lower.includes("rose") && !lower.includes("white"))) return "Gold";
  return null;
}

function extractVariantMetal(variant: any): string | undefined {
  const candidates = [variant.option1, variant.option2, variant.option3, variant.title]
    .filter(Boolean)
    .map((v) => String(v));
  for (const candidate of candidates) {
    const normalized = normalizeMetalName(candidate);
    if (normalized) return normalized;
    const exact = KNOWN_METALS.find((m) => candidate.toLowerCase() === m.toLowerCase());
    if (exact) return exact;
  }
  return undefined;
}

function extractVariantSize(variant: any): string | undefined {
  const optionValues = [variant.option1, variant.option2, variant.option3]
    .filter(Boolean)
    .map((v) => String(v).trim());

  for (const value of optionValues) {
    if (/^\d+(\.\d+)?$/.test(value)) return value;
    const match = value.match(/size\s*([\d.]+)/i);
    if (match) return match[1];
  }

  const title = String(variant.title || "");
  const titleMatch = title.match(/(?:size\s*)?([\d.]+)/i);
  return titleMatch ? titleMatch[1] : undefined;
}

function getVariantOptionValue(variant: any, optionPosition: number | null): string | undefined {
  if (!optionPosition || optionPosition < 1 || optionPosition > 3) return undefined;
  const key = `option${optionPosition}` as const;
  const value = variant[key];
  return value ? String(value).trim() : undefined;
}

function parsePriceToNumber(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  const cleaned = String(value).replace(/[^0-9.\-]+/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

const ProductDetails: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const { products, loading } = useProducts();

  const productFromList = useMemo(() => {
    return products.find((p) => p.handle === handle);
  }, [products, handle]);

  const [detailedProduct, setDetailedProduct] = useState<typeof productFromList | null>(null);
  const product = detailedProduct || productFromList;

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [playingVideo, setPlayingVideo] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isAddingToBag, setIsAddingToBag] = useState(false);
  const [bagAddedPulse, setBagAddedPulse] = useState(false);
  const [selectedSize, setSelectedSize] = useState("7");
  const [selectedMetal, setSelectedMetal] = useState("Yellow Gold");
  const [quantity, setQuantity] = useState(1);
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});

  const media = useMemo(() => {
    if (!product) return [] as Array<{ type: 'image' | 'video'; src: string; thumbnail?: string; alt?: string }>;
    return product.media || [];
  }, [product]);

  const optionPositions = useMemo(() => {
    const options = product?.options || [];
    let metalPosition: number | null = null;
    let sizePosition: number | null = null;

    options.forEach((option, index) => {
      const name = String(option.name || '').toLowerCase();
      const position = Number(option.position || index + 1);

      if (metalPosition === null && /(metal|material|colour|color|finish)/i.test(name)) {
        metalPosition = position;
      }

      if (sizePosition === null && /size/i.test(name)) {
        sizePosition = position;
      }
    });

    return { metalPosition, sizePosition };
  }, [product?.options]);

  const variantDetails = useMemo(() => {
    if (!product?.variants || product.variants.length === 0) return [] as Array<any>;
    return product.variants.map((variant) => ({
      ...variant,
      metal: (() => {
        const explicitMetal = getVariantOptionValue(variant, optionPositions.metalPosition);
        if (explicitMetal) {
          return normalizeMetalName(explicitMetal) || explicitMetal;
        }
        return extractVariantMetal(variant);
      })(),
      size: getVariantOptionValue(variant, optionPositions.sizePosition) || extractVariantSize(variant),
    }));
  }, [product?.variants, optionPositions.metalPosition, optionPositions.sizePosition]);

  const hasMetalVariants = useMemo(() => variantDetails.some((variant) => Boolean(variant.metal)), [variantDetails]);
  const hasSizeVariants = useMemo(() => variantDetails.some((variant) => Boolean(variant.size)), [variantDetails]);

  const metalOptions = useMemo(() => {
    if (variantDetails.length === 0) {
      const tagMatches = (product?.tags || [])
        .map((tag) => tag.trim())
        .filter((tag) => KNOWN_METALS.includes(tag));
      const fallback = [product?.metal, ...tagMatches].filter(Boolean) as string[];
      return fallback.length ? Array.from(new Set(fallback)) : ["Yellow Gold", "Rose Gold", "White Gold"];
    }

    const filteredBySize = hasSizeVariants && selectedSize
      ? variantDetails.filter((v) => !v.size || v.size === selectedSize)
      : variantDetails;

    const source = filteredBySize.some((v) => v.available)
      ? filteredBySize.filter((v) => v.available)
      : filteredBySize;

    const values = source.map((v) => v.metal).filter(Boolean) as string[];
    const unique = Array.from(new Set(values));
    return unique.length ? unique : ["Yellow Gold", "Rose Gold", "White Gold"];
  }, [variantDetails, product?.metal, product?.tags, selectedSize, hasSizeVariants]);

  const sizeOptions = useMemo(() => {
    if (variantDetails.length === 0) return ["5", "6", "7", "8", "9"];

    const filteredByMetal = hasMetalVariants && selectedMetal
      ? variantDetails.filter((v) => !v.metal || v.metal === selectedMetal)
      : variantDetails;

    const source = filteredByMetal.some((v) => v.available)
      ? filteredByMetal.filter((v) => v.available)
      : filteredByMetal;

    const values = source.map((v) => v.size).filter(Boolean) as string[];
    const unique = Array.from(new Set(values));
    return unique.length ? unique : ["5", "6", "7", "8", "9"];
  }, [variantDetails, selectedMetal, hasMetalVariants]);

  const selectedVariant = useMemo(() => {
    if (variantDetails.length === 0) return null;

    const candidates = variantDetails.filter((variant) => {
      const metalOk = hasMetalVariants && selectedMetal ? variant.metal === selectedMetal : true;
      const sizeOk = hasSizeVariants && selectedSize ? variant.size === selectedSize : true;
      return metalOk && sizeOk;
    });

    return candidates.find((variant) => variant.available) || null;
  }, [variantDetails, selectedMetal, selectedSize, hasMetalVariants, hasSizeVariants]);

  const displayPrice = selectedVariant?.price || product?.price || "£0.00";
  const displayComparePrice = selectedVariant?.comparePrice || product?.comparePrice || "";
  const hasVariantChoices = variantDetails.length > 0;
  const isVariantSelectionValid = !hasVariantChoices || Boolean(selectedVariant?.available);

  const canonicalUrl = useMemo(() => {
    if (!product?.handle) return undefined;
    if (typeof window === 'undefined') return `/products/${product.handle}`;
    return `${window.location.origin}/products/${product.handle}`;
  }, [product?.handle]);

  const seoDescription = useMemo(() => {
    const raw = (product?.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (raw) return raw.slice(0, 160);
    if (product?.name) {
      return `${product.name} by House of Midas. Explore handcrafted luxury jewellery with verified purity and insured global transit.`;
    }
    return 'House of Midas product details.';
  }, [product?.description, product?.name]);

  const productJsonLd = useMemo(() => {
    if (!product || !canonicalUrl) return undefined;

    const imageSources = [
      product.image,
      ...media.filter((item) => item.type === 'image').map((item) => item.src),
    ]
      .map((src) => {
        try {
          if (!src) return null;
          const base = typeof window !== 'undefined' ? window.location.origin : canonicalUrl;
          return new URL(src, base).toString();
        } catch {
          return null;
        }
      })
      .filter(Boolean) as string[];

    const uniqueImages = Array.from(new Set(imageSources));
    const selectedPrice = parsePriceToNumber(selectedVariant?.price || product.price);
    const variantUrl = selectedVariant?.id
      ? `${canonicalUrl}?variant=${encodeURIComponent(String(selectedVariant.id))}`
      : canonicalUrl;

    const schema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: seoDescription,
      category: product.category,
      brand: {
        '@type': 'Brand',
        name: 'House of Midas',
      },
      image: uniqueImages,
      offers: {
        '@type': 'Offer',
        url: variantUrl,
        priceCurrency: 'GBP',
        price: selectedPrice.toFixed(2),
        availability: isVariantSelectionValid ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
      },
    };

    if (selectedVariant?.sku) {
      schema.sku = selectedVariant.sku;
      (schema.offers as Record<string, unknown>).sku = selectedVariant.sku;
    }

    return schema;
  }, [product, canonicalUrl, media, seoDescription, selectedVariant?.id, selectedVariant?.price, selectedVariant?.sku, isVariantSelectionValid]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return [...products]
      .filter((p) => p.handle !== product.handle)
      .sort((a, b) => {
        const aScore = Number(a.category === product.category) + Number(a.metal === product.metal);
        const bScore = Number(b.category === product.category) + Number(b.metal === product.metal);
        return bScore - aScore;
      })
      .slice(0, 4);
  }, [products, product]);

  React.useEffect(() => {
    if (product) {
      setActiveIndex(0);
      setPlayingVideo(false);
    }
  }, [product?.id]);

  // Preload image helper
  const preloadSrc = (src?: string) => {
    if (!src) return;
    if (loadedMap[src]) return;
    const img = new Image();
    img.src = src;
    img.onload = () => setLoadedMap((m) => ({ ...m, [src]: true }));
    img.onerror = () => setLoadedMap((m) => ({ ...m, [src]: false }));
  };

  // Preload current and neighbor images when activeIndex or media changes
  React.useEffect(() => {
    if (!media || media.length === 0) return;
    const current = media[activeIndex];
    const prev = media[(activeIndex - 1 + media.length) % media.length];
    const next = media[(activeIndex + 1) % media.length];
    preloadSrc(current?.src);
    preloadSrc(prev?.src);
    preloadSrc(next?.src);
  }, [activeIndex, media]);

  const prevMedia = () => {
    if (!media || media.length === 0) return;
    setActiveIndex((i) => {
      const ni = (i - 1 + media.length) % media.length;
      setPlayingVideo(media[ni]?.type === 'video');
      return ni;
    });
  };

  const nextMedia = () => {
    if (!media || media.length === 0) return;
    setActiveIndex((i) => {
      const ni = (i + 1) % media.length;
      setPlayingVideo(media[ni]?.type === 'video');
      return ni;
    });
  };

  React.useEffect(() => {
    let mounted = true;
    if (!handle) return;
    (async () => {
      try {
        const p = await getProductByHandle(handle);
        if (mounted && p) setDetailedProduct(p as any);
      } catch (err) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [handle]);

  const estimatedArrival = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }, []);

  React.useEffect(() => {
    if (metalOptions.length) {
      setSelectedMetal((prev) => (metalOptions.includes(prev) ? prev : metalOptions[0]));
    }
  }, [metalOptions]);

  React.useEffect(() => {
    if (sizeOptions.length) {
      setSelectedSize((prev) => (sizeOptions.includes(prev) ? prev : sizeOptions[0]));
    }
  }, [sizeOptions]);

  React.useEffect(() => {
    if (!product) return;

    let mounted = true;
    const syncWishlist = async () => {
      try {
        const { items } = await getWishlistItems();
        if (mounted) {
          const isPresent = items.some(
            (item) => String(item.id) === String(product.id) || (item.handle && item.handle === product.handle),
          );
          setIsWishlisted(isPresent);
        }
      } catch (err) {
        console.warn("Failed to sync wishlist state", err);
      }
    };

    syncWishlist();

    const handleUpdate = () => syncWishlist();
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener("wishlist-updated", handleUpdate);
    };
  }, [product?.id, product?.handle]);

  React.useEffect(() => {
    if (!product) return;
    const trackedVariant = selectedVariant || null;
    trackViewItem({
      shopifyProductId: product.shopifyId,
      productName: product.name,
      category: product.category,
      variantId: trackedVariant?.id,
      variantName: trackedVariant?.title,
      price: trackedVariant?.price || product.price,
    });
  }, [product?.shopifyId, product?.name, product?.category, product?.price, selectedVariant?.id, selectedVariant?.price, selectedVariant?.title]);

  const handleAddToCart = async () => {
    if (!product || isAddingToBag) return;
    const variantId = selectedVariant?.id;
    if (!variantId) {
      toast.error("Please select an available combination");
      return;
    }
    if (!selectedVariant?.available) {
      toast.error("Selected variant is unavailable");
      return;
    }
    setIsAddingToBag(true);
    try {
      await addToCart(variantId, quantity);
      trackAddToCart({
        shopifyProductId: product.shopifyId,
        productName: product.name,
        category: product.category,
        variantId,
        variantName: selectedVariant?.title,
        price: selectedVariant?.price || product.price,
        quantity,
      });
      setBagAddedPulse(true);
      toast.success(`${quantity} x ${product.name} added to bag`, {
        description: "Your selection has been added to your collection.",
      });
      window.dispatchEvent(new CustomEvent("cart:updated"));
      setTimeout(() => setBagAddedPulse(false), 850);
    } catch (err) {
      toast.error("Could not add to cart");
    } finally {
      setIsAddingToBag(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    try {
      const { items } = await toggleWishlistItem(product.id, product.handle, isWishlisted);
      const nowWishlisted = items.some(
        (item) => String(item.id) === String(product.id) || (item.handle && item.handle === product.handle),
      );
      setIsWishlisted(nowWishlisted);

      if (nowWishlisted) {
        toast.success("Added to Wishlist", {
          description: "Viewing your desires is just a click away.",
        });
      } else {
        toast.info("Removed from Wishlist");
      }
      window.dispatchEvent(new Event("wishlist-updated"));
    } catch (err) {
      toast.error("Could not update wishlist");
    }
  };

  const handleShare = async () => {
    if (!product) return;
    setIsSharing(true);

    const shareData = {
      title: `House of Midas | ${product.name}`,
      text: `Discover this masterpiece from House of Midas: ${product.name}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied", {
          description: "Product link copied to clipboard for sharing.",
        });
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Could not share product");
      }
    } finally {
      setIsSharing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="h-[60vh] flex items-center justify-center bg-[#fdf8f2]">
          <Loader2 className="w-10 h-10 animate-spin text-[var(--midas-gold)]" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="h-[60vh] flex flex-col items-center justify-center bg-[#fdf8f2] px-10 text-center">
          <h2 className="font-playfair-display text-4xl mb-6 italic text-[#1a0509]">Treasure Not Found</h2>
          <p className="text-[#1a0509]/60 mb-8 max-w-md italic">
            The specific piece you are looking for may have been moved or is no longer available in our current
            selection.
          </p>
          <Link to="/collections" className="px-10 py-3.5 bg-[#1a0509] text-[#f0cc6e] uppercase tracking-[0.4em] text-[10px]">
            Return to Collection
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageMeta
        title={product ? `${product.name} | House of Midas` : "House of Midas"}
        description={seoDescription}
        canonicalUrl={canonicalUrl}
        ogType="product"
        ogImage={product?.image}
        ogTitle={product ? `${product.name} | House of Midas` : "House of Midas"}
        ogDescription={seoDescription}
        jsonLd={productJsonLd}
      />
      <section className="relative pt-[28px] pb-[96px] bg-[#fdf8f2] overflow-hidden min-h-screen">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(92,13,26,0.04)_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(184,134,11,0.05)_0%,transparent_70%)]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-10 relative z-10">
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 mb-8 text-[9px] uppercase tracking-[0.4em] text-[#1a0509]/70 hover:text-[#1a0509] transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Treasures
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-10 xl:gap-14 items-start">
            <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-5">
              <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-visible hide-scrollbar pb-2 md:pb-0">
                {media.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveIndex(idx);
                      setPlayingVideo(m.type === 'video');
                      setLightboxOpen(true);
                    }}
                    className={`w-[68px] h-[68px] shrink-0 overflow-hidden border transition-all duration-300 ${
                      activeIndex === idx ? "border-[#d4a843]" : "border-[#1a0509]/5 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="relative w-full h-full">
                      <img src={m.thumbnail || m.src} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                      {m.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow">
                            <Play className="w-3 h-3 text-[#1a0509]" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

                <div className="flex-1 aspect-[4/5] bg-white relative overflow-hidden border border-[#1a0509]/10 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
                <AnimatePresence mode="wait">
                  {(() => {
                      const current = media[activeIndex] || { type: 'image', src: product.image, thumbnail: product.image };
                      const imgSrc = current?.src || product.image || '';
                      if (current.type === 'video' && playingVideo && current.src) {
                        return (
                          <motion.div key={`video-${activeIndex}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full h-full">
                            <video controls playsInline className="w-full h-full object-cover" poster={current.thumbnail || product.image} crossOrigin="anonymous" onError={() => { toast.error('Video failed to load'); setPlayingVideo(false); }}>
                              {Array.isArray((current as any).sources) && (current as any).sources.length ? (
                                (current as any).sources.map((s: any, i: number) => (
                                  <source key={i} src={s.url} type={s.mime_type || (s.format ? `video/${s.format}` : 'video/mp4')} />
                                ))
                              ) : (
                                <source src={current.src} />
                              )}
                              Your browser does not support HTML5 video.
                            </video>
                          <button
                            type="button"
                            aria-label="Close video"
                            onClick={() => setPlayingVideo(false)}
                            className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      );
                    }

                    if (!imgSrc) {
                      return (
                        <div key={`img-placeholder-${activeIndex}`} className="w-full h-full flex items-center justify-center bg-white">
                          <div className="text-[#1a0509]/40">Image unavailable</div>
                        </div>
                      );
                    }

                    // If image not yet loaded, show loader placeholder while preloading
                    if (!loadedMap[imgSrc]) {
                      return (
                        <div key={`img-loading-${activeIndex}`} className="w-full h-full flex items-center justify-center bg-white">
                          <Loader2 className="w-8 h-8 text-[#1a0509]/40 animate-spin" />
                        </div>
                      );
                    }

                    return (
                      <motion.img
                        key={`img-${activeIndex}-${imgSrc}`}
                        src={imgSrc}
                        alt={product.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="w-full h-full object-cover"
                      />
                    );
                  })()}
                </AnimatePresence>

                {/* Play button overlay when a video exists */}
                {/* Open lightbox on main area click (overlay) */}
                <button
                  onClick={() => setLightboxOpen(true)}
                  className="absolute inset-0 z-10"
                  aria-label="Open gallery"
                />

                {/* Prev / Next arrows on main gallery */}
                {media.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevMedia(); }}
                      aria-label="Previous"
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 rounded-full shadow hover:scale-105 transition-transform"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextMedia(); }}
                      aria-label="Next"
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/80 rounded-full shadow hover:scale-105 transition-transform"
                    >
                      <ChevronRight />
                    </button>
                  </>
                )}

                <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-[#d4a843]/40" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-[#d4a843]/40" />
              </div>
            </div>

            <div className="lg:pt-1 lg:sticky lg:top-[118px]">
              <div className="mb-7">
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="text-[9px] uppercase tracking-[0.44em] text-[#d4a843] font-medium">{product.category}</span>
                  <div className="h-px w-12 bg-[#d4a843]/30" />
                </div>

                <h1 className="font-playfair-display text-[clamp(2rem,3.1vw,2.8rem)] font-bold italic leading-[1.1] text-[#1a0509] mb-3">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 text-[1.45rem] font-jost text-[#1a0509]">
                  <span className="font-semibold">{displayPrice}</span>
                  {displayComparePrice && (
                    <span className="text-lg text-[rgba(26,5,9,0.3)] line-through decoration-[rgba(92,13,26,0.3)]">
                      {displayComparePrice}
                    </span>
                  )}
                </div>

                {/* Estimated arrival and Shipping removed as requested */}
              </div>

              <p className="font-cormorant text-[18px] md:text-[19px] italic leading-[1.65] text-[#1a0509] mb-7 pb-7 border-b border-[#1a0509]/10 font-medium">
                {product.description ||
                  "A masterpiece of artisanal craftsmanship, meticulously refined to reveal the soul of precious metals and light. This singular piece embodies the heritage and elegance that defines the House of Midas."}
              </p>

              <div className="space-y-5 mb-8">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.36em] text-[#1a0509]/60 mb-2.5">Metal</div>
                  <div className="flex flex-wrap gap-2">
                    {metalOptions.map((metal) => (
                      <button
                        key={metal}
                        onClick={() => setSelectedMetal(metal)}
                        disabled={hasVariantChoices && !variantDetails.some((v) => {
                          if (!v.available) return false;
                          const metalMatch = hasMetalVariants ? v.metal === metal : true;
                          const sizeMatch = hasSizeVariants && selectedSize ? v.size === selectedSize : true;
                          return metalMatch && sizeMatch;
                        })}
                        className={`h-9 px-3.5 text-[9px] uppercase tracking-[0.24em] border transition-colors ${
                          selectedMetal === metal
                            ? "bg-[#1a0509] text-[#f0cc6e] border-[#1a0509]"
                            : "bg-white text-[#1a0509] border-[#1a0509]/15 hover:border-[#1a0509]/40"
                        }`}
                      >
                        {metal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color section removed per design request */}

                <div>
                  <div className="text-[9px] uppercase tracking-[0.36em] text-[#1a0509]/60 mb-2.5">Ring Size</div>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={hasVariantChoices && !variantDetails.some((v) => {
                          if (!v.available) return false;
                          const metalMatch = hasMetalVariants && selectedMetal ? v.metal === selectedMetal : true;
                          const sizeMatch = hasSizeVariants ? v.size === size : true;
                          return metalMatch && sizeMatch;
                        })}
                        className={`h-9 min-w-9 px-3 border text-[11px] font-medium transition-colors ${
                          selectedSize === size
                            ? "border-[#1a0509] bg-[#1a0509] text-[#f0cc6e]"
                            : "border-[#1a0509]/15 bg-white text-[#1a0509] hover:border-[#1a0509]/40"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-[#1a0509]/10 bg-white px-3.5 py-2.5">
                  <div className="text-[9px] uppercase tracking-[0.3em] text-[#1a0509]/60">Quantity</div>
                  <div className="inline-flex items-center border border-[#1a0509]/15">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="h-9 w-9 inline-flex items-center justify-center text-[#1a0509] hover:bg-[#f6efe4] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="h-9 min-w-11 px-3 inline-flex items-center justify-center text-[#1a0509] text-sm font-medium border-x border-[#1a0509]/15">
                      {quantity}
                    </div>
                    <button
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="h-9 w-9 inline-flex items-center justify-center text-[#1a0509] hover:bg-[#f6efe4] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-8 mb-8">
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.28em] text-[#1a0509]/60 mb-1.5 font-bold">Carat Weight</h4>
                  <div className="font-jost text-[1.85rem] font-bold text-[#1a0509] leading-tight">{product.caratWeight ?? '—'}</div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#d4a843] font-black mt-1.5 antialiased">
                    {product.caratNote ?? ''}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.28em] text-[#1a0509]/60 mb-1.5 font-bold">Cut Grade</h4>
                  <div className="font-jost text-[1.85rem] font-bold text-[#1a0509] leading-tight">{product.cutGrade ?? '—'}</div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#d4a843] font-black mt-1.5 antialiased">
                    {product.cutNote ?? ''}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.28em] text-[#1a0509]/60 mb-1.5 font-bold">Clarity</h4>
                  <div className="font-jost text-[1.85rem] font-bold text-[#1a0509] leading-tight">{product.clarity ?? '—'}</div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#d4a843] font-black mt-1.5 antialiased">
                    {product.clarityNote ?? ''}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-[0.28em] text-[#1a0509]/60 mb-1.5 font-bold">Origin</h4>
                  <div className="font-jost text-[1.85rem] font-bold text-[#1a0509] leading-tight">{product.origin ?? '—'}</div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#d4a843] font-black mt-1.5 antialiased">
                    {product.originNote ?? ''}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-8">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isAddingToBag || !isVariantSelectionValid}
                  whileTap={{ scale: 0.97 }}
                  animate={
                    bagAddedPulse
                      ? {
                          scale: [1, 1.035, 1],
                          boxShadow: [
                            "0 18px 36px rgba(0,0,0,0.18)",
                            "0 24px 48px rgba(212,168,67,0.35)",
                            "0 18px 36px rgba(0,0,0,0.18)",
                          ],
                        }
                      : { scale: 1 }
                  }
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="w-full bg-[#1a0509] text-[#f0cc6e] py-[18px] md:py-5 uppercase tracking-[0.36em] text-[10px] font-semibold transition-all hover:bg-[#2a080e] relative overflow-hidden group shadow-xl disabled:opacity-80"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-[#5c0d1a] to-[#d4a843] origin-left transition-transform duration-[450ms] opacity-20 ${
                      bagAddedPulse ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    <ShoppingBag className={`w-4 h-4 ${isAddingToBag ? "animate-pulse" : bagAddedPulse ? "animate-bounce" : ""}`} />
                    {isAddingToBag ? "Adding..." : bagAddedPulse ? "Added" : "Place In Bag"}
                  </span>
                </motion.button>

                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#1a0509]/70">
                  <Check className="w-4 h-4 text-[#d4a843]" />
                  {isVariantSelectionValid
                    ? `Selected: ${selectedMetal} | Size ${selectedSize}`
                    : `Unavailable combination: ${selectedMetal} | Size ${selectedSize}`}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleWishlistToggle}
                    className={`h-12 border border-[#1a0509]/10 transition-all flex items-center justify-center
                      ${isWishlisted ? "bg-[#5c0d1a] text-white border-[#5c0d1a]" : "text-[#1a0509] hover:bg-white hover:border-[#1a0509]/30 shadow-sm"}`}
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    disabled={isSharing}
                    className="h-12 border border-[#1a0509]/10 text-[#1a0509] hover:bg-white hover:border-[#1a0509]/30 transition-all flex items-center justify-center disabled:opacity-50 shadow-sm"
                    title="Share Product"
                  >
                    <Share2 className={`w-5 h-5 ${isSharing ? "animate-pulse" : ""}`} />
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 mb-9">
                <details className="group border border-[#1a0509]/10 bg-white/60 px-4 py-3" open>
                  <summary className="cursor-pointer list-none text-[10px] uppercase tracking-[0.28em] text-[#1a0509] font-semibold">
                    Product Details
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#1a0509]/75">
                    {product.description ||
                      "Each creation is forged with precision and finished by hand to preserve brilliance, balance, and timeless wearability."}
                  </p>
                </details>
                <details className="group border border-[#1a0509]/10 bg-white/60 px-4 py-3">
                  <summary className="cursor-pointer list-none text-[10px] uppercase tracking-[0.28em] text-[#1a0509] font-semibold">
                    Shipping & Returns
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[#1a0509]/75">
                    Complimentary insured shipping and carefully packaged delivery. Returns are accepted within the policy
                    window for unworn pieces.
                  </p>
                </details>
              </div>

              <div className="grid grid-cols-3 pt-8 border-t border-[#1a0509]/10 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-widest text-[#1a0509]/70 font-semibold">Insured</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#1a0509]/80">Global Transit</div>
                </div>
                <div className="space-y-2 border-x border-[#1a0509]/10">
                  <div className="text-[11px] uppercase tracking-widest text-[#1a0509]/70 font-semibold">Handmade</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#1a0509]/80">Artisanal Soul</div>
                </div>
                <div className="space-y-2">
                  <div className="text-[11px] uppercase tracking-widest text-[#1a0509]/70 font-semibold">Verified</div>
                  <div className="text-[9px] uppercase tracking-[0.2em] font-medium text-[#1a0509]/80">Certified Purity</div>
                </div>
              </div>
            </div>
          </div>

          {lightboxOpen && (
            <Lightbox media={media.length ? media : [{ type: 'image', src: product.image }]} initialIndex={activeIndex} onClose={() => setLightboxOpen(false)} />
          )}

          {relatedProducts.length > 0 && (
            <div className="mt-14 border-t border-[#1a0509]/10 pt-10">
              <div className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.36em] text-[#d4a843] font-medium mb-2">Curated For You</div>
                  <h2 className="font-playfair-display italic text-[clamp(1.4rem,2.2vw,2rem)] text-[#1a0509] leading-tight">
                    You May Also Like
                  </h2>
                </div>
                <Link to="/collections" className="text-[10px] uppercase tracking-[0.3em] text-[#1a0509]/70 hover:text-[#1a0509]">
                  View All
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.handle}
                    to={`/products/${item.handle}`}
                    className="group border border-[#1a0509]/10 bg-white/80 hover:bg-white transition-colors"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-[#f4ede2]">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="px-3 py-3.5 lg:px-4 lg:py-4">
                      <div className="text-[8px] uppercase tracking-[0.28em] text-[#1a0509]/55 mb-1.5">{item.category}</div>
                      <div className="font-jost text-[12px] md:text-[13px] uppercase tracking-[0.12em] text-[#1a0509] mb-1.5 line-clamp-2 min-h-[34px]">
                        {item.name}
                      </div>
                      <div className="font-jost text-[13px] text-[#1a0509] font-medium">{item.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetails;



