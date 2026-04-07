import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ShopifyCustomerProvider, useShopifyCustomer } from '@/contexts/ShopifyCustomerContext';
import React from 'react';

function Consumer() {
  const { customer } = useShopifyCustomer();
  return <div data-testid="customer">{customer ? customer.firstName : 'no'}</div>;
}

describe('ShopifyCustomerContext', () => {
  it('reads injected window customer', () => {
    (window as any).__SHOPIFY_CUSTOMER__ = { firstName: 'Asha' };
    const { getByTestId } = render(
      <ShopifyCustomerProvider>
        <Consumer />
      </ShopifyCustomerProvider>
    );
    expect(getByTestId('customer').textContent).toBe('Asha');
  });
});
