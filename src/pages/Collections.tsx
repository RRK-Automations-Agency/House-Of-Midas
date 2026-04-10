import React, { useState, useMemo, useEffect } from "react";
import Layout from "@/components/layouts/Layout";
import ProductCard from "@/components/ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, Search, Loader2, ChevronDown } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { getAssetUrl } from "@/lib/utils";
import PageMeta from "@/components/common/PageMeta";
import { createPortal } from "react-dom";
import { normalizeCategory as sharedNormalizeCategory, normalizeMetal, getColorHex } from "@/lib/normalize";

type PriceBand = {
  key: string;
  label: string;
  min: number;
  max: number | null;
};

const PRICE_BANDS: PriceBand[] = [
  { key: "all", label: "All Prices", min: 0, max: null },
  { key: "0-2000", label: "Under £2,000", min: 0, max: 2000 },
  { key: "2000-5000", label: "£2,000 - £5,000", min: 2000, max: 5000 },
  { key: "5000-10000", label: "£5,000 - £10,000", min: 5000, max: 10000 },
  { key: "10000-20000", label: "£10,000 - £20,000", min: 10000, max: 20000 },
  { key: "20000-plus", label: "£20,000+", min: 20000, max: null },
];

const Collections: React.FC = () => {
  const { products, loading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<string[]>(["Availability", "Category", "Colors", "Price"]);
  const [selectedColor, setSelectedColor] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedPriceBand, setSelectedPriceBand] = useState("all");

  // Helper function to extract numeric price from formatted string
  const extractPrice = (priceString: string): number => {
    if (!priceString) return 0;
    // Remove currency symbol (£, $, etc) and spaces
    let cleaned = priceString.replace(/[£$€¥]/g, '').trim();
    // Remove commas (thousands separator)
    cleaned = cleaned.replace(/,/g, '');
    // Parse as float to handle decimals properly
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Only use live Shopify products — no static fallback
  const displayProducts = products;

  // Sync with URL search parameter 'q'
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isFilterOpen) return;

    const scrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalLeft = document.body.style.left;
    const originalRight = document.body.style.right;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.left = originalLeft;
      document.body.style.right = originalRight;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isFilterOpen]);

  const currentCategory = searchParams.get("category") || "All";

  const normalizeColorValue = (raw?: string): string | undefined => {
    if (!raw?.trim()) return undefined;
    const compact = raw.replace(/\s+/g, " ").trim();
    const normalized = normalizeMetal(compact) ?? compact;
    const cleaned = normalized.replace(/\s+/g, " ").trim();

    // Keep logic dynamic: if a value still contains digits after normalization,
    // treat it as a variant/size token instead of a display color.
    if (/\d/.test(cleaned)) return undefined;

    return cleaned;
  };
  
  const isProductAvailable = (product: any): boolean => {
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants.some((v: any) => v.available);
    }
    return true;
  };

  // Dynamic categories discovered from Shopify products — no hardcoded list
  const categories = useMemo(() => {
    const countMap = new Map<string, number>();

    displayProducts.forEach((product) => {
      const raw = String(product.category || "").trim();
      if (!raw) return;
      if (raw.toLowerCase() === "jewellery") return;

      const normalized = sharedNormalizeCategory(raw);
      countMap.set(normalized, (countMap.get(normalized) || 0) + 1);
    });

    // Sort categories by product count (most products first)
    const sorted = Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);

    return ["All", ...sorted];
  }, [displayProducts]);

  // Dynamic colors discovery from option values and metal fallback
  const availableColors = useMemo(() => {
    const colorMap = new Map<string, string>();

    const addColor = (raw?: string) => {
      const normalized = normalizeColorValue(raw);
      if (!normalized) return;
      const key = normalized.toLowerCase();
      if (!colorMap.has(key)) {
        colorMap.set(key, normalized);
      }
    };

    displayProducts.forEach((product) => {
      if (Array.isArray(product.options)) {
        product.options.forEach((option) => {
          const optionName = option.name?.toLowerCase() || "";
          if (optionName.includes("color") || optionName.includes("colour")) {
            option.values?.forEach((value) => {
              addColor(value);
            });
          }
        });
      }

      addColor(product.metal);
    });

    return Array.from(colorMap.values()).sort((a, b) => a.localeCompare(b));
  }, [displayProducts]);

  const availabilityOptions = useMemo(() => {
    const inStockCount = displayProducts.filter((p) => isProductAvailable(p)).length;
    const outOfStockCount = displayProducts.length - inStockCount;

    const options = [{ key: "all", label: "All Pieces" }];
    if (inStockCount > 0) options.push({ key: "in-stock", label: "In Stock" });
    if (outOfStockCount > 0) options.push({ key: "out-of-stock", label: "Out of Stock" });

    return options;
  }, [displayProducts]);

  const hasCategoryFilter = categories.length > 1;
  const hasColorFilter = availableColors.length > 0;
  const hasAvailabilityFilter = availabilityOptions.length > 1;

  const activePriceBand = useMemo(
    () => PRICE_BANDS.find((band) => band.key === selectedPriceBand) || PRICE_BANDS[0],
    [selectedPriceBand],
  );

  // Map metal types to their colors for display — uses shared utility
  const getColorChip = getColorHex;

  const filteredProducts = useMemo(() => {
    let result = displayProducts.filter((product) => {
      const productCategory = sharedNormalizeCategory(String(product.category || ""));
      const selectedCategory = sharedNormalizeCategory(currentCategory);
      const matchesCategory = currentCategory === "All" || productCategory === selectedCategory;

      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const productColorValues = new Set<string>();
      const normalizedProductMetal = normalizeColorValue(product.metal);
      if (normalizedProductMetal) productColorValues.add(normalizedProductMetal);
      if (Array.isArray(product.options)) {
        product.options.forEach((option) => {
          const optionName = option.name?.toLowerCase() || "";
          if (optionName.includes("color") || optionName.includes("colour")) {
            option.values?.forEach((value) => {
              const normalizedValue = normalizeColorValue(value);
              if (normalizedValue) productColorValues.add(normalizedValue);
            });
          }
        });
      }

      const matchesColor = selectedColor === "All" || productColorValues.has(selectedColor);
      const isAvailable = isProductAvailable(product);
      const matchesAvailability =
        selectedAvailability === "all" ||
        (selectedAvailability === "in-stock" && isAvailable) ||
        (selectedAvailability === "out-of-stock" && !isAvailable);
      
      const priceValue = extractPrice(product.price);
      const matchesPrice = activePriceBand.max === null
        ? priceValue >= activePriceBand.min
        : priceValue >= activePriceBand.min && priceValue <= activePriceBand.max;

      return matchesCategory && matchesSearch && matchesColor && matchesAvailability && matchesPrice;
    });

    if (sortBy === "price-asc") {
       result.sort((a, b) => {
         const pA = extractPrice(a.price);
         const pB = extractPrice(b.price);
         return pA - pB;
       });
    } else if (sortBy === "price-desc") {
       result.sort((a, b) => {
         const pA = extractPrice(a.price);
         const pB = extractPrice(b.price);
         return pB - pA;
       });
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    } else if (sortBy === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name, undefined, { sensitivity: "base" }));
    }

    return result;
  }, [
    currentCategory,
    searchQuery,
    displayProducts,
    selectedColor,
    selectedAvailability,
    sortBy,
    activePriceBand,
  ]);

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const canonicalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/collections${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    : '/collections';

  return (
    <Layout noPadding>
      <PageMeta
        title="Collections | House of Midas"
        description="Browse House of Midas collections by category, metal, and premium price tiers to find your perfect piece."
        canonicalUrl={canonicalUrl}
        ogTitle="Collections | House of Midas"
        ogDescription="Explore rings, necklaces, earrings, bracelets, and bangles crafted with precision."
      />
      {/* ── HERO SECTION ── */}
  <section className="relative h-[min(80vh,680px)] min-h-[420px] md:h-screen md:min-h-[680px] flex flex-col items-center justify-end text-center overflow-hidden px-10 pb-20">
          <div className="absolute inset-0 z-0">
            <img 
              src={getAssetUrl("/images/products/1000128460.png")}
              alt="Hero Background"
              loading="lazy"
              decoding="async"
              className="w-full h-[580px] sm:h-[640px] md:h-[900px] lg:h-[1350px] object-cover object-[50%_65%] brightness-95"
            />
            {/* Layered Veils - reduce overlay opacity on small screens so featured product remains visible */}
            <div className="absolute inset-0 md:opacity-100 opacity-60">
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a0509]/60 via-transparent via-[30%] via-transparent via-[65%] to-[#1a0509]/95" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(26,5,9,0.4)_100%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(60,5,14,0.55)_0%,transparent_70%)]" />
            </div>
          </div>

  <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-0 pt-6 md:pt-0">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-4 text-[7.5px] uppercase tracking-[0.78em] text-[#d4a843]/50 mb-7"
          >
            <span className="w-1 h-1 bg-[#d4a843]/45 rounded-full" />
            The Collection
            <span className="w-1 h-1 bg-[#d4a843]/45 rounded-full" />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-7"
          >
            {/* reduced minimum for very small screens so h1 doesn't dominate */}
            <h1 className="text-[clamp(36px,8vw,120px)] leading-[0.85] font-playfair-display font-bold italic text-white tracking-tight drop-shadow-2xl">
              House of Midas
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-[clamp(13px,1.2vw,18px)] font-playfair-display italic text-white/70 mb-12"
          >
            Where fire meets heritage, and gold becomes soul.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center max-w-lg mx-auto"
          >
            <div className="flex-1 px-5 border-r border-white/10">
              <span className="block text-2xl font-playfair-display font-bold italic text-white mb-1.5">{displayProducts.length}+</span>
              <span className="text-[7px] uppercase tracking-[0.46em] text-white/45">Curated Pieces</span>
            </div>
            <div className="flex-1 px-5 border-r border-white/10">
              <span className="block text-2xl font-playfair-display font-bold italic text-white mb-1.5">18k</span>
              <span className="text-[7px] uppercase tracking-[0.46em] text-white/45">Gold Standard</span>
            </div>
            <div className="flex-1 px-5">
              <span className="block text-2xl font-playfair-display font-bold italic text-white mb-1.5">100%</span>
              <span className="text-[7px] uppercase tracking-[0.46em] text-white/45">Handcrafted</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 right-12 hidden md:flex flex-col items-center gap-3 opacity-60">
          <span className="text-[7px] uppercase tracking-[0.55em] text-[#d4a843]/40 [writing-mode:vertical-rl]">Scroll</span>
          <div className="w-[1px] h-11 bg-[#d4a843]/20 relative overflow-hidden">
            <motion.div 
              animate={{ top: ["-100%", "200%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-1/2 bg-gradient-to-b from-transparent to-[#d4a843]/60"
            />
          </div>
        </div>
      </section>

      {/* ── COLLECTION GRID ── */}
      <section className="bg-[#fdf8f2] min-h-screen">
        {/* Topbar */}
        <div
          className="sticky z-40 bg-[#fdf8f2]/95 backdrop-blur-md border-b border-[#1a0509]/10 px-6 sm:px-12 py-4 flex flex-wrap items-center gap-5"
          style={{ top: "var(--shopify-navbar-height, 72px)" }}
        >
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden flex items-center gap-2.5 px-5 py-3 border border-[#1a0509]/10 text-[10px] uppercase tracking-[0.38em] text-[#1a0509]"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>

          <div className="relative flex-grow max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1a0509]/40" />
            <input 
              type="text" 
              placeholder="Search pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-transparent border border-[#1a0509]/15 text-xs tracking-wider focus:outline-none focus:border-[var(--midas-gold)]"
            />
          </div>

          <div className="text-base italic text-[#1a0509]/70 ml-auto whitespace-nowrap flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-[#1a0509]/40">Sort</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-[11px] uppercase tracking-widest text-[#1a0509] focus:outline-none cursor-pointer font-medium"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A to Z</option>
                <option value="name-desc">Alphabetical: Z to A</option>
              </select>
            </div>
            <span><strong className="font-semibold text-[#1a0509] not-italic">{filteredProducts.length}</strong> items</span>
          </div>
        </div>

  <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-[258px_1fr] px-6 sm:px-12 pt-10 pb-12 sm:pb-24 gap-12">
          {/* Sidebar */}
          <aside className="hidden lg:block space-y-8 sticky top-36 h-fit">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.52em] text-[var(--midas-gold)] font-medium mb-8">
              Refine
              <div className="flex-grow h-[1px] bg-[#1a0509]/10" />
            </div>

            {/* Availability Filter */}
            {hasAvailabilityFilter && (
              <div className="space-y-4">
                <button
                  onClick={() => toggleGroup("Availability")}
                  className="w-full flex items-center justify-between text-left text-[11.5px] uppercase tracking-widest text-[#1a0509] border-b border-[#1a0509]/10 pb-3"
                >
                  Availability
                  <ChevronDown className={`w-3 h-3 transition-transform ${openGroups.includes("Availability") ? "rotate-180" : ""}`} />
                </button>
                {openGroups.includes("Availability") && (
                  <div className="pt-2 space-y-2">
                    {availabilityOptions.map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setSelectedAvailability(option.key)}
                        className={`w-full rounded-sm border px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.22em] transition-colors ${
                          selectedAvailability === option.key
                            ? "border-[#1a0509] bg-[#1a0509] text-[#f0cc6e]"
                            : "border-[#1a0509]/15 bg-white/60 text-[#1a0509] hover:border-[#1a0509]/35"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Category Filter */}
            {hasCategoryFilter && (
              <div className="space-y-4">
              <button 
                onClick={() => toggleGroup("Category")}
                className="w-full flex items-center justify-between text-left text-[11.5px] uppercase tracking-widest text-[#1a0509] border-b border-[#1a0509]/10 pb-3"
              >
                Category
                <ChevronDown className={`w-3 h-3 transition-transform ${openGroups.includes("Category") ? "rotate-180" : ""}`} />
              </button>
              {openGroups.includes("Category") && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      // Note: We use searchParams for categories as requested before
                      onClick={() => setSearchParams(cat === "All" ? {} : { category: cat })}
                      className={`px-4 py-2.5 text-[10.5px] uppercase tracking-widest border transition-all ${
                        currentCategory === cat 
                          ? "bg-[#1a0509] text-[#f0cc6e] border-[#1a0509]" 
                          : "border-[#1a0509]/15 text-[#1a0509] hover:border-[var(--midas-gold)] hover:text-[var(--midas-gold)] bg-transparent"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
              </div>
            )}

            {/* Colors Filter */}
            {hasColorFilter && (
              <div className="space-y-4">
              <button 
                onClick={() => toggleGroup("Colors")}
                className="w-full flex items-center justify-between text-left text-[11.5px] uppercase tracking-widest text-[#1a0509] border-b border-[#1a0509]/10 pb-3"
              >
                Colors
                <ChevronDown className={`w-3 h-3 transition-transform ${openGroups.includes("Colors") ? "rotate-180" : ""}`} />
              </button>
              {openGroups.includes("Colors") && availableColors.length > 0 && (
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => setSelectedColor("All")}
                    className={`w-full flex items-center gap-3 p-2 border transition-all ${
                      selectedColor === "All" 
                        ? "border-[#1a0509] bg-[#1a0509]/5" 
                        : "border-transparent hover:bg-white/50"
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ background: 'conic-gradient(#e5c786, #e5b299, #e5e5e5, #e5c786)' }}
                    />
                    <span className={`text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium transition-colors ${selectedColor === "All" ? "text-[#1a0509]" : "text-[#1a0509]/80"}`}>
                      All Colors
                    </span>
                  </button>
                  
                  {availableColors.map((color) => {
                    const chip = getColorChip(color);
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-full flex items-center gap-3 p-2 border transition-all ${
                          selectedColor === color
                            ? "border-[#1a0509] bg-[#1a0509]/5" 
                            : "border-transparent hover:bg-white/50"
                        }`}
                      >
                        <div 
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: chip.light }}
                        />
                        <span className={`text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-medium transition-colors ${selectedColor === color ? "text-[#1a0509]" : "text-[#1a0509]/80"}`}>
                          {color}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              </div>
            )}

            {/* Price Filter */}
            <div className="space-y-4 pt-4">
              <button 
                onClick={() => toggleGroup("Price")}
                className="w-full flex items-center justify-between text-left text-[11.5px] uppercase tracking-widest text-[#1a0509] border-b border-[#1a0509]/10 pb-3"
              >
                Price Range
                <ChevronDown className={`w-3 h-3 transition-transform ${openGroups.includes("Price") ? "rotate-180" : ""}`} />
              </button>
              {openGroups.includes("Price") && (
                <div className="pt-4 space-y-2">
                  {PRICE_BANDS.map((band) => (
                    <button
                      key={band.key}
                      type="button"
                      onClick={() => setSelectedPriceBand(band.key)}
                      className={`w-full rounded-sm border px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.22em] transition-colors ${
                        selectedPriceBand === band.key
                          ? "border-[#1a0509] bg-[#1a0509] text-[#f0cc6e]"
                          : "border-[#1a0509]/15 bg-white/60 text-[#1a0509] hover:border-[#1a0509]/35"
                      }`}
                    >
                      {band.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filter */}
            {(searchParams.toString() !== "" || selectedColor !== "All" || selectedAvailability !== "all" || selectedPriceBand !== "all" || searchQuery !== "") && (
              <button 
                onClick={() => {
                  setSearchParams({});
                  setSelectedColor("All");
                  setSelectedAvailability("all");
                  setSelectedPriceBand("all");
                  setSearchQuery("");
                }}
                className="w-full flex items-center justify-center gap-2 py-4 text-[10px] uppercase tracking-[0.2em] text-[#1a0509]/50 hover:text-[var(--midas-gold)] transition-colors border border-dashed border-[#1a0509]/10 hover:border-[var(--midas-gold)]/30"
              >
                <X className="w-3 h-3" />
                Clear all filters
              </button>
            )}
          </aside>

          {/* Grid Area */}
          <div className="flex-grow">
            {loading && products.length === 0 ? (
              <div className="h-[400px] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-[var(--midas-gold)]" />
                <p className="font-playfair-display italic text-[#1a0509]/60">Sourcing treasures...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-24 bg-white/50 border border-[#1a0509]/10">
                <p className="font-playfair-display text-5xl text-[#1a0509]/30 mb-4 italic">No treasures found</p>
                <p className="text-[#1a0509]/60 italic font-playfair-display mb-8">Try adjusting your refine parameters or searching again.</p>
                <button 
                  onClick={() => {setSearchParams({}); setSearchQuery("");}}
                  className="px-10 py-3.5 bg-[#1a0509] text-[#f0cc6e] uppercase tracking-[0.42em] text-[10px] hover:bg-[var(--midas-gold)] transition-all"
                >
                  View All Pieces
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── MOBILE DRAWER ── */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                onTouchMove={(e) => e.preventDefault()}
                className="fixed inset-0 z-[2147483645] bg-[#1a0509]/60 backdrop-blur-sm lg:hidden"
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-[300px] bg-[#fdf8f2] z-[2147483646] p-8 lg:hidden shadow-2xl flex flex-col"
                style={{
                  WebkitOverflowScrolling: "touch",
                  height: "100dvh",
                  maxHeight: "100dvh",
                }}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-10 shrink-0">
                  <span className="text-[10px] uppercase tracking-[0.52em] text-[var(--midas-gold)] font-medium">Refine</span>
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    aria-label="Close filters"
                    className="w-10 h-10 rounded-full border border-[#1a0509] bg-[#1a0509] text-[#f0cc6e] flex items-center justify-center shadow-sm transition-all hover:scale-105 active:scale-95"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-grow min-h-0 overflow-y-auto overscroll-contain touch-pan-y pr-1" style={{ WebkitOverflowScrolling: "touch" }}>
                  <div className="space-y-10">
                {hasAvailabilityFilter && (
                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-widest text-[#1a0509] border-b border-[#1a0509]/10 pb-3">Availability</h3>
                    <div className="flex flex-wrap gap-2">
                      {availabilityOptions.map((option) => (
                        <button
                          key={option.key}
                          onClick={() => setSelectedAvailability(option.key)}
                          className={`px-3 py-2 border text-[10px] uppercase tracking-widest transition-all ${
                            selectedAvailability === option.key
                              ? "bg-[#1a0509] text-[#f0cc6e] border-[#1a0509]"
                              : "border-[#1a0509]/15 text-[#1a0509]"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hasCategoryFilter && (
                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-widest text-[#1a0509] border-b border-[#1a0509]/10 pb-3">Category</h3>
                    <div className="flex flex-col gap-4">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSearchParams(cat === "All" ? {} : { category: cat });
                          }}
                          className={`text-left font-playfair-display text-2xl italic transition-colors ${
                            currentCategory === cat ? "text-[var(--midas-gold)]" : "text-[#1a0509]/40 hover:text-[#1a0509]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {hasColorFilter && (
                  <div className="space-y-6">
                    <h3 className="text-xs uppercase tracking-widest text-[#1a0509] border-b border-[#1a0509]/10 pb-3">Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedColor("All")}
                        className={`px-3 py-2 border text-[10px] uppercase tracking-widest transition-all ${
                          selectedColor === "All"
                            ? "bg-[#1a0509] text-[#f0cc6e] border-[#1a0509]"
                            : "border-[#1a0509]/15 text-[#1a0509]"
                        }`}
                      >
                        All
                      </button>
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-2 border text-[10px] uppercase tracking-widest transition-all ${
                            selectedColor === color
                              ? "bg-[#1a0509] text-[#f0cc6e] border-[#1a0509]"
                              : "border-[#1a0509]/15 text-[#1a0509]"
                          }`}
                        >
                          {color.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <h3 className="text-xs uppercase tracking-widest text-[#1a0509] border-b border-[#1a0509]/10 pb-3">Price Range</h3>
                  <div className="space-y-2">
                    {PRICE_BANDS.map((band) => (
                      <button
                        key={band.key}
                        type="button"
                        onClick={() => setSelectedPriceBand(band.key)}
                        className={`w-full rounded-sm border px-3 py-2.5 text-left text-[10px] uppercase tracking-[0.22em] transition-colors ${
                          selectedPriceBand === band.key
                            ? "border-[#1a0509] bg-[#1a0509] text-[#f0cc6e]"
                            : "border-[#1a0509]/15 bg-white/60 text-[#1a0509]"
                        }`}
                      >
                        {band.label}
                      </button>
                    ))}
                  </div>
                </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3 shrink-0">
                  <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-4 bg-[#1a0509] text-[#f0cc6e] text-[10px] uppercase tracking-[0.2em] font-medium"
                  >
                    Show {filteredProducts.length} Items
                  </button>
                  <button 
                    onClick={() => {
                      setSearchParams({});
                      setSelectedColor("All");
                      setSelectedAvailability("all");
                      setSelectedPriceBand("all");
                      setSearchQuery("");
                      setIsFilterOpen(false);
                    }}
                    className="w-full py-3 text-[10px] uppercase tracking-widest text-[#1a0509]/40"
                  >
                    Clear All
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </Layout>
  );
};

export default Collections;
