import React, { useEffect } from 'react';
import Layout from "@/components/layouts/Layout";

interface AccountRedirectProps {
  target: 'login' | 'register' | 'logout' | 'addresses' | 'orders' | 'cart' | 'wishlist' | 'product' | 'search';
}

const AccountRedirect: React.FC<AccountRedirectProps> = ({ target }) => {
  const urls = {
    login: '/account/login',
    register: '/account/register',
    logout: '/account/logout',
    addresses: '/account/addresses',
    orders: '/account',
    cart: '/cart',
    wishlist: '/wishlist',
    product: '/products/', // Prefix for products
    search: '/search',
  };

  useEffect(() => {
    const targetUrl = urls[target];
    const currentPath = window.location.pathname;
    
    // Check if we are already on a matching native path
    const isMatchingPath = target === 'product' 
      ? currentPath.startsWith('/products/') 
      : currentPath === targetUrl;

    if (!isMatchingPath) {
      // If we entered through a React route but aren't on the native URL yet, redirect.
      if (target !== 'product') {
        window.location.href = targetUrl;
      }
      return;
    }

    // Mount Shopify native content into the React layout container.
    const shopifyContent = document.getElementById('shopify-content');
    const container = document.getElementById('native-mounting-point');
    if (!shopifyContent || !container) return;

    const originalParent = shopifyContent.parentElement;
    const originalNextSibling = shopifyContent.nextSibling;

    shopifyContent.style.display = 'block';
    if (!container.contains(shopifyContent)) {
      container.appendChild(shopifyContent);
    }

    return () => {
      if (!originalParent) return;
      try {
        if (originalNextSibling && originalParent.contains(originalNextSibling)) {
          originalParent.insertBefore(shopifyContent, originalNextSibling);
        } else {
          originalParent.appendChild(shopifyContent);
        }
        shopifyContent.style.display = 'none';
      } catch (restoreErr) {
        console.warn('Failed to restore Shopify native content after unmount', restoreErr);
      }
    };
  }, [target]);

  const currentPath = window.location.pathname;
  const isMatchingPath = target === 'product' 
    ? currentPath.startsWith('/products/') 
    : currentPath === urls[target];

  // If we are at the target URL, render the Layout with a mounting point for the native content
  if (isMatchingPath) {
    return (
      <Layout>
        <div 
          className="min-h-[60vh] pt-0 pb-20 bg-[#fdf8f2]"
          style={{
            background: `
              radial-gradient(ellipse 800px 500px at 90% 20%, rgba(92,13,26,0.04) 0%, transparent 60%),
              radial-gradient(ellipse 600px 400px at 5% 85%, rgba(184,134,11,0.05) 0%, transparent 55%),
              linear-gradient(180deg, #fdf8f2 0%, #f5ead8 50%, #fdf8f2 100%)
            `
          }}
        >
          <div id="native-mounting-point" className="max-w-[1400px] mx-auto px-5 md:px-10" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-[#fdf8f2]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[var(--midas-gold)] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="font-playfair-display italic text-xl text-[#1a0509]">Refining your experience...</p>
        </div>
      </div>
    </Layout>
  );
};

export default AccountRedirect;
