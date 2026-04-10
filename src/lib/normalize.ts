/**
 * Shared normalization utilities for Shopify data.
 * These avoid hardcoding categories/metals/colors — if Shopify sends a new value,
 * it passes through instead of being silently dropped.
 */

/**
 * Normalize a category string from Shopify into a consistent display form.
 * Known categories get capitalised plural names (e.g. "ring" → "Rings").
 * Unknown categories are title-cased and passed through so they still appear.
 */
export function normalizeCategory(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "Jewellery";

  const lower = trimmed.toLowerCase();

  // Known category synonyms → canonical plural display name
  const KNOWN: Record<string, string> = {
    ring: "Rings",
    rings: "Rings",
    necklace: "Necklaces",
    necklaces: "Necklaces",
    earring: "Earrings",
    earrings: "Earrings",
    bracelet: "Bracelets",
    bracelets: "Bracelets",
    bangle: "Bangles",
    bangles: "Bangles",
    pendant: "Pendants",
    pendants: "Pendants",
    anklet: "Anklets",
    anklets: "Anklets",
    brooch: "Brooches",
    brooches: "Brooches",
    watch: "Watches",
    watches: "Watches",
    chain: "Chains",
    chains: "Chains",
  };

  if (KNOWN[lower]) return KNOWN[lower];

  // Passthrough: title-case whatever Shopify sends
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Normalize a metal / color string.
 * Known values get a clean display name; unknown values pass through.
 */
export function normalizeMetal(raw: string): string | undefined {
  if (!raw) return undefined;
  const lower = raw.toLowerCase().trim();
  if (!lower) return undefined;

  if (lower === "yellow" || (lower.includes("yellow") && lower.includes("gold"))) return "Yellow Gold";
  if (lower === "rose" || (lower.includes("rose") && lower.includes("gold"))) return "Rose Gold";
  if (lower === "white" || (lower.includes("white") && lower.includes("gold"))) return "White Gold";
  if (lower.includes("platinum")) return "Platinum";
  if (lower.includes("sterling") || lower === "silver") return "Sterling Silver";
  if (lower.includes("titanium")) return "Titanium";
  if (lower.includes("palladium")) return "Palladium";

  // Passthrough — don't drop unknown metals
  return raw.trim();
}

/**
 * Map a color/metal name to a hex color for swatch display.
 * Returns a fallback for unknown values instead of hiding them.
 */
export function getColorHex(colorName: string): { light: string; dark: string } {
  const COLOR_MAP: Record<string, { light: string; dark: string }> = {
    "Yellow Gold": { light: "#e5c786", dark: "#b39d5f" },
    "Rose Gold": { light: "#e5b299", dark: "#b38966" },
    "White Gold": { light: "#e5e5e5", dark: "#b3b3b3" },
    "Platinum": { light: "#d8dee4", dark: "#a0aab4" },
    "Sterling Silver": { light: "#c0c5cb", dark: "#8e959d" },
    "Silver": { light: "#c0c5cb", dark: "#8e959d" },
    "Titanium": { light: "#b0b7c0", dark: "#808890" },
    "Gold": { light: "#e5c786", dark: "#b39d5f" },
  };

  // Exact match first
  if (COLOR_MAP[colorName]) return COLOR_MAP[colorName];

  // Partial match (case-insensitive)
  const lower = colorName.toLowerCase();
  for (const [key, value] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key.toLowerCase())) return value;
  }

  // Generic fallback — a neutral gold tone
  return { light: "#d4a843", dark: "#a88235" };
}
