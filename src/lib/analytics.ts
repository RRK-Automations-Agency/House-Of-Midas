import { hasAnalyticsConsent } from "@/lib/consent";

type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
};

type AnalyticsPayload = {
  currency: string;
  value?: number;
  items: AnalyticsItem[];
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, any>>;
    gtag?: (...args: any[]) => void;
  }
}

const CURRENCY = "GBP";

function parsePrice(value: string | number | undefined): number {
  if (value === undefined || value === null) return 0;
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const cleaned = String(value).replace(/[^0-9.\-]+/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function emitEcommerceEvent(eventName: string, payload: AnalyticsPayload): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ecommerce: payload,
  });
}

export function trackViewItem(input: {
  shopifyProductId: string;
  productName: string;
  category?: string;
  variantId?: string;
  variantName?: string;
  price?: string | number;
}): void {
  const price = parsePrice(input.price);
  emitEcommerceEvent("view_item", {
    currency: CURRENCY,
    value: price,
    items: [
      {
        item_id: String(input.shopifyProductId || ""),
        item_name: String(input.productName || ""),
        item_brand: "House of Midas",
        item_category: input.category,
        item_variant: input.variantName || input.variantId,
        price,
        quantity: 1,
      },
    ],
  });
}

export function trackAddToCart(input: {
  shopifyProductId: string;
  productName: string;
  category?: string;
  variantId?: string;
  variantName?: string;
  price?: string | number;
  quantity: number;
}): void {
  const quantity = Number.isFinite(input.quantity) ? input.quantity : 1;
  const price = parsePrice(input.price);
  emitEcommerceEvent("add_to_cart", {
    currency: CURRENCY,
    value: price * quantity,
    items: [
      {
        item_id: String(input.shopifyProductId || ""),
        item_name: String(input.productName || ""),
        item_brand: "House of Midas",
        item_category: input.category,
        item_variant: input.variantName || input.variantId,
        price,
        quantity,
      },
    ],
  });
}

export function trackBeginCheckout(input: {
  value: number;
  items: AnalyticsItem[];
  currency?: string;
}): void {
  emitEcommerceEvent("begin_checkout", {
    currency: input.currency || CURRENCY,
    value: Number.isFinite(input.value) ? input.value : 0,
    items: input.items || [],
  });
}

export function trackPurchase(input: {
  value: number;
  items: AnalyticsItem[];
  transactionId: string;
  tax?: number;
  shipping?: number;
  currency?: string;
}): void {
  const payload: AnalyticsPayload & { transaction_id: string; tax?: number; shipping?: number } = {
    currency: input.currency || CURRENCY,
    value: Number.isFinite(input.value) ? input.value : 0,
    items: input.items || [],
    transaction_id: String(input.transactionId || ""),
  };

  if (typeof input.tax === "number" && Number.isFinite(input.tax)) payload.tax = input.tax;
  if (typeof input.shipping === "number" && Number.isFinite(input.shipping)) payload.shipping = input.shipping;

  emitEcommerceEvent("purchase", payload);
}
