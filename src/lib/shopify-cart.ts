/**
 * Shopify AJAX API helpers for Cart management
 * @see https://shopify.dev/docs/api/ajax
 */
import { normalizeCategory, normalizeMetal } from "@/lib/normalize";

export interface CartItem {
  id: number;
  key: string;
  title: string;
  price: number;
  line_price: number;
  quantity: number;
  image: string;
  handle: string;
  variant_id: number;
  product_title: string;
  variant_title: string;
  url: string;
}

export interface Product {
  id: string; // This will be the variant ID for easy adding
  shopifyId: string; // The product ID
  name: string;
  handle: string;
  category: string;
  price: string;
  comparePrice: string;
  description: string;
  descriptionHtml?: string;
  image: string;
  /** responsive srcSet string (e.g. '... 320w, ...') */
  srcSet?: string;
  hoverImage?: string;
  /** optional product video URL (mp4, etc.) */
  video?: string;
  /** normalized list of media (images and videos) from Shopify admin */
  media?: Array<{ type: 'image' | 'video'; src: string; thumbnail?: string; alt?: string }>;
  isHero?: boolean;
  metal?: string;
  tags?: string[];
  caratWeight?: string;
  caratNote?: string;
  cutGrade?: string;
  cutNote?: string;
  clarity?: string;
  clarityNote?: string;
  origin?: string;
  originNote?: string;
  variants?: ProductVariant[];
  options?: ProductOption[];
}

export interface ProductVariant {
  id: string;
  title: string;
  available: boolean;
  option1?: string;
  option2?: string;
  option3?: string;
  price: string;
  comparePrice?: string;
  sku?: string;
}

export interface ProductOption {
  name: string;
  position: number;
  values: string[];
}

export interface ShopifyCart {
  item_count: number;
  items: CartItem[];
  total_price: number;
}

/**
 * Get the current cart state
 */
export async function getCart(): Promise<ShopifyCart> {
  const response = await fetch("/cart.js");
  if (!response.ok) throw new Error("Failed to fetch cart");
  return response.json();
}

/**
 * Add an item to the cart
 * @param id The variant ID
 * @param quantity The quantity to add
 */
export async function addToCart(id: string | number, quantity: number = 1): Promise<void> {
  const isShopify = typeof window !== 'undefined' && !!(window as any).ShopifyAssetUrl;
  if (isShopify) {
    const variantId = Number(id);
    if (isNaN(variantId)) {
      throw new Error(`Invalid variant ID: ${id}`);
    }
  }

  const response = await fetch("/cart/add.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: [{ id: variantId, quantity }] }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    throw new Error(errorData.description || errorData.message || "Failed to add to cart");
  }
  
  // Notify other components (like Navbar) that the cart has been updated
  window.dispatchEvent(new CustomEvent("cart:updated"));
}

/**
 * Change the quantity of an item in the cart
 * @param key The item key or line index
 * @param quantity The new quantity
 */
export async function updateCartItem(key: string, quantity: number): Promise<ShopifyCart> {
  const response = await fetch("/cart/change.js", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: key, quantity }),
  });
  if (!response.ok) throw new Error("Failed to update cart");
  
  window.dispatchEvent(new CustomEvent("cart:updated"));
  return response.json();
}

/**
 * Remove an item from the cart
 * @param key The item key or line index
 */
export async function removeFromCart(key: string): Promise<ShopifyCart> {
  return updateCartItem(key, 0);
}

/**
 * Fetch products from Shopify AJAX API
 */
export async function getShopifyProducts(): Promise<Product[]> {
  try {
    // 1. Try our high-fidelity JSON View template first (includes the Standard Category taxonomy)
    let productsData = null;
    try {
      const response = await fetch("/search?view=json-products&q=*", { cache: "no-store" });
      if (response.ok) {
        productsData = await response.json();
      }
    } catch (e) {
      console.warn("Custom JSON view failed, falling back to standard API", e);
    }

    // 2. Fallback to standard Shopify AJAX API if bridge failed or is empty
    if (!productsData || !Array.isArray(productsData) || productsData.length === 0) {
      try {
        const response = await fetch("/collections/all/products.json?limit=50");
        if (response.ok) {
          const data = await response.json();
          productsData = data.products || [];
        }
      } catch (e) {
        // ignore and fallback to local mock data
      }
    }
    
    // 3. Fallback to local mock data if productsData is empty or unavailable
    if (!productsData || !Array.isArray(productsData) || productsData.length === 0) {
      const { PRODUCTS } = await import("./mock-data");
      return PRODUCTS;
    }
    
    return productsData.map(mapShopifyProduct);
  } catch (error) {
    console.error("Error fetching products, falling back to mock data:", error);
    try {
      const { PRODUCTS } = await import("./mock-data");
      return PRODUCTS;
    } catch (e) {
      return [];
    }
  }
}

/**
 * Fetch a single product by handle from Shopify and map it to our Product shape.
 */
export async function getProductByHandle(handle: string): Promise<Product | null> {
  if (!handle) return null;
  try {
    // Prefer the standard product JSON which includes the full `media` array (images + videos)
    try {
      const resp = await fetch(`/products/${encodeURIComponent(handle)}.js`, { cache: 'no-store' });
      if (resp.ok) {
        const data = await resp.json();
        return mapShopifyProduct(data);
      }
    } catch (e) {
      // ignore and fallback to custom JSON view
    }

    // Fallback: try the custom JSON view which may include metafields but often lacks `media`
    try {
      const q = encodeURIComponent(handle);
      const respView = await fetch(`/search?view=json-products&q=${q}`, { cache: 'no-store' });
      if (respView.ok) {
        const list = await respView.json();
        if (Array.isArray(list) && list.length > 0) {
          const found = list.find((p: any) => String(p.handle) === String(handle));
          if (found) return mapShopifyProduct(found);
        }
      }
    } catch (e) {
      // ignore
    }

    // Try local mock fallback
    const { PRODUCTS } = await import("./mock-data");
    const found = PRODUCTS.find((p) => p.handle === handle);
    if (found) return found;

    return null;
  } catch (err) {
    console.warn('Failed to fetch product by handle', handle, err);
    try {
      const { PRODUCTS } = await import("./mock-data");
      const found = PRODUCTS.find((p) => p.handle === handle);
      if (found) return found;
    } catch (e) {}
    return null;
  }
}

/**
 * Map Shopify product object to our Application Product interface
 */
function mapShopifyProduct(p: any): Product {
  const variants: ProductVariant[] = Array.isArray(p.variants)
    ? p.variants.map((v: any) => ({
        id: String(v.id),
        title: String(v.title || ''),
        available: v.available !== false,
        option1: v.option1 ? String(v.option1) : undefined,
        option2: v.option2 ? String(v.option2) : undefined,
        option3: v.option3 ? String(v.option3) : undefined,
        price: formatShopifyPrice(v.price),
        comparePrice: v.compare_at_price ? formatShopifyPrice(v.compare_at_price) : undefined,
        sku: v.sku ? String(v.sku) : undefined,
      }))
    : [];

  const firstVariant = variants.find((v) => v.available) || variants[0] || null;

  const options: ProductOption[] = Array.isArray(p.options)
    ? p.options.map((opt: any, index: number) => ({
        name: typeof opt === 'string' ? opt : String(opt?.name || `Option ${index + 1}`),
        position: Number(opt?.position || index + 1),
        values: Array.isArray(opt?.values)
          ? opt.values.map((v: any) => String(v)).filter(Boolean)
          : [],
      }))
    : [];

  const extractImageSrc = (imageLike: any): string => {
    if (!imageLike) return "";
    if (typeof imageLike === "string") return imageLike;
    if (typeof imageLike.src === "string") return imageLike.src;
    if (typeof imageLike.url === "string") return imageLike.url;
    return "";
  };

  const imageCandidates: string[] = [];
  if (Array.isArray(p.images)) {
    for (const img of p.images) {
      const src = extractImageSrc(img);
      if (src && !imageCandidates.includes(src)) imageCandidates.push(src);
    }
  }

  const featuredImageCandidate =
    extractImageSrc(p.featured_image) || extractImageSrc(p.image);
  if (featuredImageCandidate && !imageCandidates.includes(featuredImageCandidate)) {
    imageCandidates.unshift(featuredImageCandidate);
  }

  const primaryImage = imageCandidates[0] || "";
  const secondImage = imageCandidates[1] || primaryImage;
  // Try to extract a video URL from Shopify product media (if present)
  let videoUrl = "";
  try {
    if (Array.isArray(p.media)) {
      const vid = p.media.find((m: any) => m.media_type === 'video' || m.media_type === 'external_video');
      if (vid) {
        if (Array.isArray(vid.sources) && vid.sources.length && vid.sources[0].url) {
          videoUrl = vid.sources[0].url;
        } else if (vid.external_url) {
          videoUrl = vid.external_url;
        }
      }
    }
  } catch (e) {
    // ignore
  }
  // Build normalized media list (images + videos) from p.media when available
  const mediaItems: Array<{ type: 'image' | 'video'; src: string; thumbnail?: string; alt?: string }> = [];
  try {
    if (Array.isArray(p.media) && p.media.length > 0) {
      for (const m of p.media) {
        if (!m) continue;
        if (m.media_type === 'image') {
          const src = m.image?.src || m.src || '';
          if (src && !mediaItems.find(x => x.src === src)) {
            mediaItems.push({ type: 'image', src, thumbnail: m.preview_image?.src || src, alt: m.alt || p.title });
          }
        } else if (m.media_type === 'video' || m.media_type === 'external_video') {
          let src = '';
          const sources: Array<{ url: string; mime_type?: string; format?: string; height?: number; width?: number }> = [];
          if (Array.isArray(m.sources) && m.sources.length) {
            for (const s of m.sources) {
              if (s && s.url) sources.push({ url: s.url, mime_type: s.mime_type, format: s.format, height: s.height, width: s.width });
            }
            if (sources.length) src = sources[0].url;
          } else if (m.external_url) {
            src = m.external_url;
            sources.push({ url: m.external_url });
          }
          const thumb = m.preview_image?.src || (m.image && m.image.src) || '';
          if (src && !mediaItems.find(x => x.src === src)) {
            mediaItems.push({ type: 'video', src, thumbnail: thumb, alt: m.alt || p.title, ...(sources.length ? { sources } : {}) });
          }
        }
      }
    }
  } catch (e) {
    /* ignore */
  }
  // Fallback: use resolved image candidates if no media entries found
  if (mediaItems.length === 0 && imageCandidates.length > 0) {
    const seen = new Set<string>();
    for (const src of imageCandidates) {
      if (src && !seen.has(src)) {
        mediaItems.push({ type: 'image', src, thumbnail: src, alt: p.title });
        seen.add(src);
      }
    }
  }
  const specs = p?.metafields?.specs || {};
  const tagList: string[] = p.tags
    ? (Array.isArray(p.tags)
        ? p.tags.map((t: any) => String(t).trim())
        : String(p.tags).split(',').map((t: string) => t.trim()))
    : [];

  return {
    id: firstVariant ? String(firstVariant.id) : String(p.id),
    shopifyId: String(p.id),
    name: p.title,
    handle: p.handle,
    category: (() => {
      // 1. Primary: Category emitted by our JSON view (taxonomy-aware)
      if (typeof p.category === 'string' && p.category.trim() !== "" && p.category.trim().toLowerCase() !== "jewellery") {
        return normalizeCategory(p.category);
      }

      // 2. Secondary: Shopify type/product_type when present
      const rawType = String(p.product_type || p.type || "").trim();
      if (rawType && rawType.toLowerCase() !== "jewellery") {
        return normalizeCategory(rawType);
      }

      // 3. Fallback: Keep unclassified products in Jewellery
      return "Jewellery";
    })(),
    price: firstVariant ? firstVariant.price : "£0.00",
    comparePrice: firstVariant?.comparePrice || "",
    // Keep full plain-text description (strip HTML but do not truncate)
    description: ((p.body_html || p.description) || "").replace(/<[^>]*>?/gm, "").trim(),
    descriptionHtml: p.body_html || p.description || "",
    image: primaryImage,
    srcSet: buildShopifySrcSet(primaryImage),
    hoverImage: secondImage,
    video: videoUrl || undefined,
    media: mediaItems,
    isHero: tagList.some((tag) => tag.toLowerCase() === 'hero'),
    metal: (() => {
      // First check tags (case-insensitive)
      if (tagList.length > 0) {
        for (const tag of tagList) {
          const normalized = normalizeMetal(tag);
          if (normalized) return normalized;
        }
      }
      
      // Then check variant titles (common in Shopify)
      if (variants.length > 0) {
        for (const v of variants) {
          const normalized = normalizeMetal(v.title || "");
          if (normalized) return normalized;
        }
      }
      
      return undefined;
    })(),
    tags: tagList,
    caratWeight: specs.carat_weight || undefined,
    caratNote: specs.carat_note || undefined,
    cutGrade: specs.cut_grade || undefined,
    cutNote: specs.cut_note || undefined,
    clarity: specs.clarity || undefined,
    clarityNote: specs.clarity_note || undefined,
    origin: specs.origin || undefined,
    originNote: specs.origin_note || undefined,
    variants,
    options,
  };
}

/**
 * Safely format a Shopify price value into a localized GBP string.
 * Accepts numbers or numeric strings (e.g. "29.00" or 2900 in cents). Falls back to £0.00
 */
export function formatShopifyPrice(value: any): string {
  if (value === undefined || value === null) return "£0.00";
  
  // Clean the input to get a numeric string
  const strValue = String(value).replace(/[^0-9.\-]+/g, '');
  let n = Number(strValue);
  if (!isFinite(n)) return "£0.00";

  // If the input doesn't have a decimal point and is handled as an integer, 
  // it's likely Shopify's cents-based price (e.g., 2900 -> 29.00)
  if (!strValue.includes('.') && Number.isInteger(n)) {
    n = n / 100;
  }

  return `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Build a Shopify-style srcSet from an image URL by inserting size tokens.
 * Example: /products/foo.jpg -> /products/foo_320x320.jpg 320w, /products/foo_480x480.jpg 480w, ...
 * This uses square variants which are safe for product thumbnails. If the source
 * URL already contains sizing tokens the browser will still accept the generated ones.
 */
function buildShopifySrcSet(src: string): string {
  if (!src) return "";
  
  // Disable srcSet generation when running locally (no ShopifyAssetUrl)
  const isShopify = typeof window !== 'undefined' && !!(window as any).ShopifyAssetUrl;
  if (!isShopify) return "";
  
  try {
    // Use URL to preserve origin and query params
    const u = new URL(src, typeof window !== 'undefined' ? window.location.origin : undefined);
    const pathname = u.pathname;
    const lastDot = pathname.lastIndexOf('.');
    if (lastDot === -1) return "";
    const base = pathname.substring(0, lastDot);
    const ext = pathname.substring(lastDot);
    const widths = [320, 480, 768, 1024, 1600];
    const parts = widths.map((w) => {
      const sizedPath = `${base}_${w}x${w}${ext}`;
      const full = `${u.origin}${sizedPath}${u.search}`;
      return `${full} ${w}w`;
    });
    return parts.join(', ');
  } catch (err) {
    // Fallback: try a simple string manipulation
    const idx = src.lastIndexOf('.');
    if (idx === -1) return "";
    const base = src.substring(0, idx);
    const ext = src.substring(idx);
    const widths = [320, 480, 768, 1024, 1600];
    return widths.map(w => `${base}_${w}x${w}${ext} ${w}w`).join(', ');
  }
}




