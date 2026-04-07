import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { getWishlistItems, toggleWishlistItem } from '@/lib/wishlist';

describe('wishlist helpers', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    (window as any).__SHOPIFY_CUSTOMER__ = null;
    (window as any).__WISHLIST_API_BASE__ = '/';
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    localStorage.clear();
    (window as any).__SHOPIFY_CUSTOMER__ = null;
    (window as any).__WISHLIST_API_BASE__ = undefined;
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('reads wishlist from local storage for guests', async () => {
    localStorage.setItem('hom-wishlist', JSON.stringify(['a', 'b']));

    const result = await getWishlistItems();

    expect(result.items).toEqual([
      { id: '', handle: 'a' },
      { id: '', handle: 'b' },
    ]);
    expect(result.source).toBe('local');
  });

  it('uses the API for logged-in customers when available', async () => {
    (window as any).__SHOPIFY_CUSTOMER__ = { id: 123 };

    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes('/api/health')) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true }) } as Response);
      }
      if (url.includes('/api/wishlist/session')) {
        return Promise.resolve({ ok: true, json: async () => ({ csrfToken: 'token-1' }) } as Response);
      }
      if (url.includes('/api/wishlist')) {
        return Promise.resolve({ ok: true, json: async () => ({ wishlist: ['x'] }) } as Response);
      }
      return Promise.resolve({ ok: false, json: async () => ({}) } as Response);
    });

    const result = await getWishlistItems();

    expect(result.items).toEqual([{ id: 'x', handle: 'x' }]);
    expect(result.source).toBe('customer');
  });

  it('merges local wishlist with customer wishlist and syncs once', async () => {
    (window as any).__SHOPIFY_CUSTOMER__ = { id: 123 };
    localStorage.setItem('hom-wishlist', JSON.stringify([{ id: 'local-item', handle: 'local-item' }]));

    const fetchMock = globalThis.fetch as ReturnType<typeof vi.fn>;
    fetchMock.mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes('/api/health')) {
        return Promise.resolve({ ok: true, json: async () => ({ ok: true }) } as Response);
      }
      if (url.includes('/api/wishlist/session')) {
        return Promise.resolve({ ok: true, json: async () => ({ csrfToken: 'token-1' }) } as Response);
      }
      if (url.includes('/api/wishlist') && (!init || init.method === 'GET')) {
        return Promise.resolve({ ok: true, json: async () => ({ wishlist: ['remote-item'] }) } as Response);
      }
      if (url.includes('/api/wishlist') && init?.method === 'POST') {
        const payload = JSON.parse(String(init.body || '{}'));
        if (payload.action === 'set') {
          return Promise.resolve({ ok: true, json: async () => ({ wishlist: ['remote-item', 'local-item'] }) } as Response);
        }
      }
      return Promise.resolve({ ok: false, json: async () => ({}) } as Response);
    });

    const result = await getWishlistItems();

    expect(result.items).toEqual([
      { id: 'remote-item', handle: 'remote-item' },
      { id: 'local-item', handle: 'local-item' },
    ]);
    expect(result.source).toBe('customer');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/wishlist'),
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('toggles wishlist locally when API is unavailable', async () => {
    const result = await toggleWishlistItem('p1', 'p1-handle', false);

    expect(result.items).toEqual([{ id: 'p1', handle: 'p1-handle' }]);
    expect(localStorage.getItem('hom-wishlist')).toBe(JSON.stringify([{ id: 'p1', handle: 'p1-handle' }]));
  });
});
