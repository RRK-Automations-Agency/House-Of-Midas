export type WishlistSource = 'customer' | 'local';

export interface WishlistItem {
  id: string;
  handle: string;
}

export interface WishlistResult {
  items: WishlistItem[];
  source: WishlistSource;
}

const LOCAL_KEY = 'hom-wishlist';
let apiAvailability: boolean | null = null;
let csrfToken: string | null = null;
let warnedInvalidApiBase = false;

function getApiBase(): string {
  if (typeof window === 'undefined') return '';
  return sanitizeApiBase((window as any).__WISHLIST_API_BASE__ ?? '');
}

function sanitizeApiBase(rawBase: string): string {
  const value = String(rawBase || '').trim();
  if (!value) return '';

  if (value === '/') return '/';

  if (value.startsWith('/')) {
    return value.replace(/\/$/, '');
  }

  try {
    if (typeof window === 'undefined') return '';
    const parsed = new URL(value, window.location.origin);
    if (parsed.origin !== window.location.origin) {
      throw new Error('cross-origin api base');
    }
    return parsed.pathname.replace(/\/$/, '');
  } catch (_err) {
    if (!warnedInvalidApiBase) {
      warnedInvalidApiBase = true;
      console.warn('Ignoring invalid wishlist API base. Expected a same-origin absolute URL or /apps/* path.');
    }
    return '';
  }
}

function buildApiUrl(path: string): string {
  const base = getApiBase();
  if (!base) return path;
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

function getInjectedCustomerId(): string | null {
  if (typeof window === 'undefined') return null;
  const injected = (window as any).__SHOPIFY_CUSTOMER__ ?? null;
  if (!injected || injected.id === undefined || injected.id === null) return null;
  return String(injected.id);
}

function hasInjectedCustomer(): boolean {
  return Boolean(getInjectedCustomerId());
}

function normalizeWishlistItem(item: unknown, source: 'local' | 'api' = 'api'): WishlistItem | null {
  if (typeof item === 'string') {
    const value = item.trim();
    if (!value) return null;
    if (source === 'local') {
      return { id: '', handle: value };
    }
    return { id: value, handle: value };
  }

  if (!item || typeof item !== 'object') return null;
  const payload = item as Record<string, unknown>;
  const id = typeof payload.id === 'string' ? payload.id.trim() : '';
  const handle = typeof payload.handle === 'string' ? payload.handle.trim() : '';
  if (!id && !handle) return null;
  return { id, handle };
}

function itemKey(item: WishlistItem): string {
  return item.handle || item.id;
}

function dedupeWishlistItems(items: WishlistItem[]): WishlistItem[] {
  const map = new Map<string, WishlistItem>();
  items.forEach((item) => {
    const key = itemKey(item);
    if (!key) return;
    if (!map.has(key)) map.set(key, item);
  });
  return Array.from(map.values());
}

function mergeWishlistItems(serverItems: WishlistItem[], localItems: WishlistItem[]): WishlistItem[] {
  return dedupeWishlistItems([...serverItems, ...localItems]);
}

function toServerWishlistKeys(items: WishlistItem[]): string[] {
  return dedupeWishlistItems(items)
    .map((item) => itemKey(item).trim())
    .filter((value) => value.length > 0);
}

function readLocalWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  const saved = window.localStorage.getItem(LOCAL_KEY);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    const normalized = parsed
      .map((entry) => normalizeWishlistItem(entry, 'local'))
      .filter((entry): entry is WishlistItem => Boolean(entry));
    return dedupeWishlistItems(normalized);
  } catch (err) {
    console.warn('Failed to parse local wishlist, resetting.', err);
    return [];
  }
}

function writeLocalWishlist(items: WishlistItem[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(dedupeWishlistItems(items)));
}

function updateLocalWishlist(itemId: string, itemHandle: string, isWishlisted: boolean): WishlistItem[] {
  const current = readLocalWishlist();
  if (isWishlisted) {
    const next = current.filter((item) => {
      const hMatch = item.handle && item.handle === itemHandle;
      const idMatch = item.id && String(item.id) === String(itemId);
      return !hMatch && !idMatch;
    });
    writeLocalWishlist(next);
    return next;
  }
  
  const alreadyExists = current.some(item => 
    (item.handle && item.handle === itemHandle) || 
    (item.id && String(item.id) === String(itemId))
  );

  if (!alreadyExists) {
    current.push({ id: itemId, handle: itemHandle });
  }
  const deduped = dedupeWishlistItems(current);
  writeLocalWishlist(deduped);
  return deduped;
}

async function checkWishlistApi(): Promise<boolean> {
  if (apiAvailability !== null) return apiAvailability;
  // Do not probe relative /api on Shopify unless an API base is configured.
  if (!getApiBase()) {
    apiAvailability = false;
    return apiAvailability;
  }
  try {
    const res = await fetch(buildApiUrl('/api/health'), {
      method: 'GET',
      credentials: 'same-origin'
    });
    apiAvailability = res.ok;
  } catch (err) {
    apiAvailability = false;
  }
  return apiAvailability;
}

async function initWishlistSession(): Promise<boolean> {
  if (csrfToken) return true;

  const res = await fetch(buildApiUrl('/api/wishlist/session'), {
    method: 'GET',
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
  });

  if (!res.ok) return false;
  const json = await res.json();
  if (!json?.csrfToken || typeof json.csrfToken !== 'string') return false;
  csrfToken = json.csrfToken;
  return true;
}

async function fetchWishlistFromApi(): Promise<WishlistItem[]> {
  const res = await fetch(buildApiUrl('/api/wishlist'), {
    method: 'GET',
    credentials: 'same-origin',
    headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
  });
  if (!res.ok) throw new Error('Wishlist API fetch failed');
  const json = await res.json();
  const list = Array.isArray(json?.wishlist) ? json.wishlist : (Array.isArray(json) ? json : []);
  const normalized = list
    .map((entry: unknown) => normalizeWishlistItem(entry, 'api'))
    .filter((entry: WishlistItem | null): entry is WishlistItem => Boolean(entry));
  return dedupeWishlistItems(normalized);
}

async function syncWishlistViaApi(items: WishlistItem[]): Promise<WishlistItem[]> {
  const res = await fetch(buildApiUrl('/api/wishlist'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    credentials: 'same-origin',
    body: JSON.stringify({ action: 'set', items: toServerWishlistKeys(items) }),
  });

  if (!res.ok) throw new Error('Wishlist API sync failed');
  const json = await res.json();
  const list = Array.isArray(json?.wishlist) ? json.wishlist : [];
  const normalized = list
    .map((entry: unknown) => normalizeWishlistItem(entry, 'api'))
    .filter((entry: WishlistItem | null): entry is WishlistItem => Boolean(entry));
  return dedupeWishlistItems(normalized);
}

async function toggleWishlistViaApi(itemId: string, itemHandle: string, isWishlisted: boolean): Promise<WishlistItem[]> {
  const action = isWishlisted ? 'remove' : 'add';
  const res = await fetch(buildApiUrl('/api/wishlist'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    },
    credentials: 'same-origin',
    body: JSON.stringify({ action, item: itemId, handle: itemHandle })
  });
  if (!res.ok) throw new Error('Wishlist API update failed');
  const json = await res.json();
  const list = Array.isArray(json?.wishlist) ? json.wishlist : [];
  const normalized = list
    .map((entry: unknown) => normalizeWishlistItem(entry, 'api'))
    .filter((entry: WishlistItem | null): entry is WishlistItem => Boolean(entry));
  return dedupeWishlistItems(normalized);
}

export async function getWishlistItems(): Promise<WishlistResult> {
  const localItems = readLocalWishlist();

  if (hasInjectedCustomer()) {
    const apiOk = await checkWishlistApi();
    if (apiOk) {
      try {
        const hasSession = await initWishlistSession();
        if (!hasSession) throw new Error('Could not initialize wishlist session');
        const customerItems = await fetchWishlistFromApi();
        let merged = mergeWishlistItems(customerItems, localItems);

        const hasLocalOnlyItems = localItems.some((item) => {
          const key = itemKey(item);
          return key && !customerItems.some((remoteItem) => itemKey(remoteItem) === key);
        });

        if (hasLocalOnlyItems) {
          try {
            merged = await syncWishlistViaApi(merged);
          } catch (syncErr) {
            console.warn('Wishlist API sync failed, using merged local/customer state.', syncErr);
          }
        }

        writeLocalWishlist(merged);
        return { items: merged, source: 'customer' };
      } catch (err) {
        console.warn('Wishlist API fetch failed, falling back to local storage.', err);
        apiAvailability = false;
        csrfToken = null;
      }
    }
  }

  return { items: localItems, source: 'local' };
}

export async function toggleWishlistItem(itemId: string, itemHandle: string, isWishlisted: boolean): Promise<WishlistResult> {
  if (hasInjectedCustomer()) {
    const apiOk = await checkWishlistApi();
    if (apiOk) {
      try {
        const hasSession = await initWishlistSession();
        if (!hasSession) throw new Error('Could not initialize wishlist session');
        const items = await toggleWishlistViaApi(itemId, itemHandle, isWishlisted);
        writeLocalWishlist(items);
        return { items, source: 'customer' };
      } catch (err) {
        console.warn('Wishlist API update failed, falling back to local storage.', err);
        apiAvailability = false;
        csrfToken = null;
      }
    }
  }

  return { items: updateLocalWishlist(itemId, itemHandle, isWishlisted), source: 'local' };
}

