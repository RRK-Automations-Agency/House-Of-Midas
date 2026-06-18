import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
// Last Updated: 2026-03-31T17:42:00Z (Force Refresh)
import { Eye, ShoppingBag, Heart } from "lucide-react";
import { toast } from "sonner";
import { addToCart, type ProductOption } from "@/lib/shopify-cart";
import { getWishlistItems, toggleWishlistItem } from "@/lib/wishlist";
import { trackAddToCart } from "@/lib/analytics";
import { getColorHex } from "@/lib/normalize";

interface ProductCardProps {
  product: {
    id: string;
    shopifyId?: string;
    name: string;
    handle: string;
    category: string;
    price: string;
    image: string;
    /** optional srcSet for responsive images (comma-separated) */
    srcSet?: string;
    hoverImage?: string;
    isHero?: boolean;
    comparePrice?: string;
    metal?: string;
    tags?: string[];
    options?: ProductOption[];
  };
  enableHoverSwap?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, enableHoverSwap = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    let mounted = true;

    const syncWishlist = async () => {
      try {
        const { items } = await getWishlistItems();
        if (mounted) {
          const isPresent = items.some(item => 
            String(item.id) === String(product.id) || 
            (item.handle && item.handle === product.handle)
          );
          setIsWishlisted(isPresent);
        }
      } catch (err) {
        console.warn("Failed to sync wishlist state", err);
      }
    };

    syncWishlist();

    const handleWishlistUpdated = () => {
      syncWishlist();
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdated);
    return () => {
      mounted = false;
      window.removeEventListener('wishlist-updated', handleWishlistUpdated);
    };
  }, [product.id]);

  useEffect(() => {
    if (!enableHoverSwap) return;
    if (!product.hoverImage || product.hoverImage === product.image) return;
    const img = new Image();
    img.src = product.hoverImage;
  }, [enableHoverSwap, product.hoverImage, product.image]);

  // Derive swatches dynamically from product options or metal field
  const swatches = useMemo(() => {
    const colorValues: string[] = [];
    
    // Check options for color/colour/metal type options
    if (Array.isArray(product.options)) {
      for (const opt of product.options) {
        const optName = (opt.name || "").toLowerCase();
        if (optName.includes("color") || optName.includes("colour") || optName.includes("metal")) {
          if (Array.isArray(opt.values)) {
            for (const v of opt.values) {
              const trimmed = v?.trim();
              if (trimmed && !colorValues.includes(trimmed)) colorValues.push(trimmed);
            }
          }
        }
      }
    }
    
    // Fallback to the single metal field if no color option found
    if (colorValues.length === 0 && product.metal?.trim()) {
      colorValues.push(product.metal.trim());
    }
    
    return colorValues.map(name => ({
      name,
      colors: getColorHex(name),
    }));
  }, [product.options, product.metal]);
  const backImage = product.hoverImage || product.image;
  const canSwap = enableHoverSwap && !!product.hoverImage && product.hoverImage !== product.image;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await addToCart(product.id, 1);
      trackAddToCart({
        shopifyProductId: product.shopifyId || product.id,
        productName: product.name,
        category: product.category,
        variantId: product.id,
        price: product.price,
        quantity: 1,
      });
      toast.success(`${product.name} added to bag`, {
        description: "You've successfully added this piece to your collection.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Could not add to cart", {
        description: "Please try again or visit the product page.",
      });
    }
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (async () => {
      try {
        const { items } = await toggleWishlistItem(product.id, product.handle, isWishlisted);
        const nowWishlisted = items.some(item => 
          String(item.id) === String(product.id) || 
          (item.handle && item.handle === product.handle)
        );
        setIsWishlisted(nowWishlisted);
        if (nowWishlisted) {
          toast.success('Added to Wishlist', {
            description: 'Viewing your desires is just a click away.'
          });
        } else {
          toast.info('Removed from Wishlist');
        }
        window.dispatchEvent(new Event('wishlist-updated'));
      } catch (err) {
        console.warn('Wishlist toggle failed', err);
        toast.error('Could not update wishlist', {
          description: 'Please try again in a moment.'
        });
      }
    })();
  };

  return (
    <div
      className="w-full relative cursor-pointer group transition-transform duration-[450ms] cubic-bezier-[0.25,0.46,0.45,0.94] z-0 group-hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-[220px] sm:h-[260px] md:h-[320px] lg:h-[360px] rounded-xl overflow-hidden bg-[#ede8e0]">
        <Link
          to={`/products/${product.handle}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setTimeout(() => setIsHovered(false), 250)}
        >
          {canSwap ? (
            <>
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                srcSet={product.srcSet}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={`absolute inset-0 w-full h-full object-cover block transition-opacity duration-300 ease-out ${isHovered ? "opacity-0" : "opacity-100"}`}
              />
              <img
                src={backImage}
                alt={product.name}
                loading="eager"
                decoding="async"
                className={`absolute inset-0 w-full h-full object-cover block transition-opacity duration-300 ease-out ${isHovered ? "opacity-100" : "opacity-0"}`}
              />
            </>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              srcSet={product.srcSet}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-full object-cover block"
            />
          )}
        </Link>

        {/* Top-aligned Actions */}
        <div className="absolute inset-0 p-3 pointer-events-none z-20">
          {Array.isArray(product.tags) && product.tags.includes('custom-made') && (
            <div className="absolute top-3 left-3 z-30 pointer-events-none">
              <span className="inline-block bg-[#f3e8ff] text-[#5b21b6] px-2 py-1 rounded-full text-[11px] font-semibold">Custom-made</span>
            </div>
          )}
          <div className="flex flex-col gap-2.5 items-start pointer-events-auto opacity-0 translate-x-[-10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <Link 
              to={`/products/${product.handle}`}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1a0509] shadow-sm transition-all hover:bg-white hover:scale-110 active:scale-95"
              title="View Product"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-[18px] h-[18px]" />
            </Link>
            <button 
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#1a0509] shadow-sm transition-all hover:bg-white hover:scale-110 active:scale-95 border-none"
              title="Add to Bag"
              onClick={handleQuickAdd}
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
            </button>
          </div>

          <div className="absolute top-3 right-3 pointer-events-auto opacity-0 translate-x-[10px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
            <button 
              className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110 active:scale-95 border-none
                ${isWishlisted ? "bg-[#5c0d1a] text-white" : "bg-white/90 backdrop-blur-sm text-[#1a0509] hover:bg-white"}`}
              title="Add to Wishlist"
              onClick={toggleWishlist}
            >
              <Heart className={`w-[18px] h-[18px] ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="pt-3 bg-transparent">
        <p className="font-jost text-sm sm:text-[11px] font-medium tracking-[0.12em] uppercase text-[#1a0509] m-0 mb-1.5 leading-[1.3] truncate">
          {product.name}
        </p>
        <div className="flex items-baseline">
          <span className="font-jost text-sm sm:text-[13px] font-medium text-[#1a0509] tracking-[0.03em]">
            {product.price}
          </span>
          {product.comparePrice && (
             <span className="font-jost text-[12px] font-normal text-[rgba(26,5,9,0.42)] line-through ml-1.5">
               {product.comparePrice}
             </span>
          )}
        </div>
        {swatches.length > 0 && (
          <div className="flex gap-[7px] items-center mt-2.5">
            {swatches.map((swatch, idx) => (
              <div
                key={swatch.name}
                title={swatch.name}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setActiveSwatch(idx);
                }}
                className="w-[13px] h-[13px] rounded-full border-[1.5px] border-transparent cursor-pointer transition-all duration-200 shrink-0 relative hover:scale-125"
                style={{ backgroundColor: swatch.colors.light }}
              >
                <div
                  className={`absolute -inset-[3px] rounded-full border transition-colors duration-200 ${
                    activeSwatch === idx ? "border-secondary" : "border-transparent"
                  }`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
