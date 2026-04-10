import { useLocation } from "react-router-dom";
import PageMeta from "@/components/common/PageMeta";

type MetaConfig = {
  title: string;
  description: string;
  noindex?: boolean;
};

const EXPLICIT_META_PATHS = new Set([
  "/",
  "/collections",
  "/wishlist",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
]);

const ROUTE_META: Record<string, MetaConfig> = {
  "/about": {
    title: "About House of Midas | Our Heritage and Craft",
    description: "Discover the heritage, artisanship, and values behind House of Midas fine jewellery.",
  },
  "/about/story": {
    title: "Our Story | House of Midas",
    description: "Read the story behind House of Midas and our commitment to modern heirloom jewellery.",
  },
  "/about/material": {
    title: "Materials | House of Midas",
    description: "Explore the premium metals, stones, and ethical sourcing standards used by House of Midas.",
  },
  "/about/design": {
    title: "Design Philosophy | House of Midas",
    description: "Learn how House of Midas blends timeless artistry with contemporary jewellery design.",
  },
  "/about/craftsmanship": {
    title: "Craftsmanship | House of Midas",
    description: "See how each House of Midas piece is meticulously crafted with precision and care.",
  },
  "/luxe": {
    title: "Luxe Collection | House of Midas",
    description: "Browse our Luxe collection featuring elevated designs, premium finishes, and statement pieces.",
  },
  "/faq": {
    title: "FAQ | House of Midas",
    description: "Find answers to common questions about orders, shipping, returns, and jewellery care.",
  },
  "/pages/jewellery-care": {
    title: "Jewellery Care Guide | House of Midas",
    description: "Protect your jewellery with expert care tips for cleaning, storage, and long-term brilliance.",
  },
  "/pages/warranty": {
    title: "Warranty | House of Midas",
    description: "Review House of Midas warranty coverage, repair terms, and support details.",
  },
  "/pages/size-guide": {
    title: "Size Guide | House of Midas",
    description: "Use our size guide to find the perfect fit for rings, bracelets, and necklaces.",
  },
  "/contact": {
    title: "Contact House of Midas | Jewellery Concierge",
    description: "Reach House of Midas for custom jewellery inquiries, order support, and concierge assistance.",
  },
};

function normalizePath(pathname: string): string {
  const path = pathname.replace(/\/+$/, "");
  return path || "/";
}

function getFallbackMeta(pathname: string): MetaConfig | null {
  if (pathname.startsWith("/products/")) return null;

  if (pathname === "/cart" || pathname === "/search" || pathname.startsWith("/account")) {
    return {
      title: "House of Midas",
      description: "House of Midas customer account and checkout experience.",
      noindex: true,
    };
  }

  return ROUTE_META[pathname] || null;
}

const RouteMeta = () => {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);

  if (EXPLICIT_META_PATHS.has(pathname)) return null;

  const config = getFallbackMeta(pathname);
  if (!config) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const canonicalUrl = origin ? `${origin}${pathname}` : undefined;

  return (
    <PageMeta
      title={config.title}
      description={config.description}
      canonicalUrl={canonicalUrl}
      noindex={Boolean(config.noindex)}
    />
  );
};

export default RouteMeta;
