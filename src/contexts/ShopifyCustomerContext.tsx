import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface ShopifyCustomer {
  id?: string | number;
  firstName?: string;
}

interface ShopifyCustomerContextType {
  customer: ShopifyCustomer | null;
  loading: boolean;
  signOut: () => void;
}

const ShopifyCustomerContext = createContext<ShopifyCustomerContextType | undefined>(undefined);

export function ShopifyCustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const win = typeof window !== 'undefined' ? (window as any) : undefined;
      const injected = win?.__SHOPIFY_CUSTOMER__ ?? null;
      setCustomer(injected);
    } catch (err) {
      console.error('Error reading injected Shopify customer:', err);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = () => {
    // Perform a POST form submit to /account/logout which is the most reliable
    // way to clear the Shopify customer session across themes/hosts.
    // Some storefronts also accept GET /account/logout, but POST is preferred.
    try {
      if (typeof window === 'undefined') return;
      const doc = window.document;
      const form = doc.createElement('form');
      form.method = 'POST';
      form.action = '/account/logout';
      // Hidden input fallback in case themes expect form fields in the body
      form.style.display = 'none';
      doc.body.appendChild(form);
      form.submit();
    } catch (err) {
      // As a fallback, navigate via href
      console.warn('POST logout failed, falling back to GET /account/logout', err);
      if (typeof window !== 'undefined') window.location.href = '/account/logout';
    }
  };

  return (
    <ShopifyCustomerContext.Provider value={{ customer, loading, signOut }}>
      {children}
    </ShopifyCustomerContext.Provider>
  );
}

export function useShopifyCustomer() {
  const ctx = useContext(ShopifyCustomerContext);
  if (ctx === undefined) throw new Error('useShopifyCustomer must be used within ShopifyCustomerProvider');
  return ctx;
}
