import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Params = Partial<
  Record<keyof URLSearchParams, string | number | null | undefined>
>;

export function createQueryString(
  params: Params,
  searchParams: URLSearchParams
) {
  const newSearchParams = new URLSearchParams(searchParams?.toString());

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined) {
      newSearchParams.delete(key);
    } else {
      newSearchParams.set(key, String(value));
    }
  }

  return newSearchParams.toString();
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-IN", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function getAssetUrl(path: string) {
  const isShopify = typeof window !== 'undefined' && !!(window as any).ShopifyAssetUrl;
  let filename = path.split('/').pop() || '';
  if (path.includes('/images/ring-sequence/')) {
    filename = `ring-${filename}`;
  }
  if (isShopify) {
    return `${(window as any).ShopifyAssetUrl}${filename}`;
  }
  
  // Locally and on Vercel, assets are served from the root of the output directory
  return `/${filename}`;
}
