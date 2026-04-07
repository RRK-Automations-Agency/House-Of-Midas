import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { bootstrapConsentPreferences } from "@/lib/consent";

declare global {
  interface Window {
    __HOM_REACT_ROOT__?: Root;
    __HOM_REACT_ROOT_EL__?: HTMLElement | null;
  }
}

// Apply any brand overrides provided by Liquid (server-side) to CSS custom properties
function applyBrandOverrides(overrides: { primary?: string | null; secondary?: string | null; text?: string | null } | undefined) {
  if (!overrides) return;
  try {
    const root = document.documentElement;
    if (overrides.primary) root.style.setProperty('--brand-primary', overrides.primary);
    if (overrides.secondary) root.style.setProperty('--brand-secondary', overrides.secondary);
    if (overrides.text) root.style.setProperty('--brand-text', overrides.text);
  } catch (e) {
    // silent
  }
}

// Initial hydration: pick up any product-level overrides injected by Liquid in product templates
applyBrandOverrides((window as any).ShopifyBrandOverrides?.product);
bootstrapConsentPreferences();

// Allow client code (or other scripts) to dispatch a custom event to update brand colours at runtime.
window.addEventListener('shopify:brand-change', (ev: Event) => {
  // event detail should contain { primary, secondary, text }
  // @ts-ignore
  const detail = (ev as CustomEvent)?.detail;
  if (detail) applyBrandOverrides(detail);
});

function renderReactApp() {
  const mountElement = document.getElementById("root");
  if (!mountElement) return;

  if (window.__HOM_REACT_ROOT__ && window.__HOM_REACT_ROOT_EL__ !== mountElement) {
    try {
      window.__HOM_REACT_ROOT__.unmount();
    } catch (_err) {
      // noop
    }
    window.__HOM_REACT_ROOT__ = undefined;
    window.__HOM_REACT_ROOT_EL__ = null;
  }

  if (!window.__HOM_REACT_ROOT__) {
    window.__HOM_REACT_ROOT__ = createRoot(mountElement);
    window.__HOM_REACT_ROOT_EL__ = mountElement;
  }

  window.__HOM_REACT_ROOT__.render(
    <StrictMode>
      <AppWrapper>
        <App />
      </AppWrapper>
    </StrictMode>
  );
}

if (document.getElementById("root")) {
  renderReactApp();
} else {
  document.addEventListener("DOMContentLoaded", renderReactApp, { once: true });
}
