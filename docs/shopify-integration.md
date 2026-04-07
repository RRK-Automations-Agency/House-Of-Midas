# Shopify integration notes and next steps

This document summarizes the production-ready integration pieces implemented and recommended next steps for a realtime, secure, and maintainable Shopify-connected storefront.

Implemented in this change

- Injected `window.__SHOPIFY_CUSTOMER__` in `layout/theme.liquid` (safe, minimal customer fields).
- Added `ShopifyCustomerProvider` in `src/contexts/ShopifyCustomerContext.tsx` and wired it into the app (`src/App.tsx`).
- Updated `src/pages/Account.tsx` to consume the provider and show signed-in or signed-out UI.
- Wired `src/components/Navbar.tsx` to:
  - Fetch initial cart count via the AJAX `/cart.js` endpoint.
  - Listen for `cart:updated` events and refresh the cart badge.
  - Show the Shopify customer's first name when available.
- Added a lightweight CI workflow (`.github/workflows/ci.yml`) that runs lint + tests on push/PR to `main`.
- Added Vitest-based unit tests for `getCart()` and `ShopifyCustomerContext` and a minimal Vitest config.

Security & production guidance

- Do NOT expose Admin API keys or sensitive tokens in client code. If you need server-side Shopify Admin access, create a backend with environment variables and call it from the client.
- For client-side product lookups and checkout flows, prefer the Storefront API (public token) or the AJAX endpoints in the theme. If you use a Storefront token from the client, restrict scopes and rotate tokens as needed.

Realtime & webhooks

- For order/inventory realtime syncing across systems, implement a small backend that subscribes to Shopify webhooks (orders/create, products/update, inventory_levels/update). When webhooks arrive you can:
  - Update your database
  - Send events to clients via WebSocket/Server-Sent Events or a 3rd-party realtime service

- If you need simple near-realtime behavior on the frontend without a server, you can poll endpoints such as `/products.json` or specific product handles at a low frequency — but a webhook-backed server is preferred.

Testing & CI

- CI: `.github/workflows/ci.yml` runs `npm ci` and `npm run ci` (which runs lint and tests). Ensure the CI environment installs devDependencies (Vitest, Testing Library) before running.
- Unit tests: small tests added under `src/__tests__` using Vitest. Run locally with `npm run test`.

Recommended additions

- Add integration tests for critical flows (add-to-cart -> cart page -> checkout redirect).
- Improve user session flows (server-side session or token exchange) if you want single-sign-on between app features and Shopify checkout.
- Implement webhook receiver (small server) if you need true realtime sync.

If you'd like, I can now:
- Run `npm ci` and `npm run ci` in this environment to validate lint and tests (note: this installs devDependencies and can be slow). Or,
- Run `npm run shopify-build && shopify theme push ...` to push your updated layout file and other changes to the store and confirm the live preview.

Which should I do next? (I can run the build/push or run CI tests.)