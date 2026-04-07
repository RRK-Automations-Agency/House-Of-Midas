import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCart } from '@/lib/shopify-cart';

describe('shopify-cart helpers', () => {
  beforeEach(() => {
    // reset fetch mock
    (globalThis as any).fetch = undefined;
  });

  it('getCart returns parsed cart.json', async () => {
    const mock = { item_count: 3, items: [], total_price: 0 };
    (globalThis as any).fetch = vi.fn(async (url: string) => ({ ok: true, json: async () => mock }));

    const cart = await getCart();
    expect(cart).toBeDefined();
    expect(cart.item_count).toBe(3);
  });
});
