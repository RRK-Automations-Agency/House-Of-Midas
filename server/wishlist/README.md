# Wishlist backend example

This folder contains a minimal Node/Express example that demonstrates how to
store a customer's wishlist in a Shopify customer metafield using the
Shopify Admin REST API. This is an example only — run it on a secure server and
keep your Admin API token secret.

Environment variables required:
- SHOPIFY_ADMIN_TOKEN - Admin API access token with permission to read/write customers/metafields
- SHOPIFY_STORE_DOMAIN - your-store.myshopify.com
- WISHLIST_SIGNING_SECRET - strong random string used to sign session and CSRF cookies

Optional (recommended for storefront app proxy setup):
- SHOPIFY_APP_PROXY_SECRET - Shopify app shared secret used to verify app-proxy signatures
- SHOPIFY_API_SECRET - fallback variable name if SHOPIFY_APP_PROXY_SECRET is not set

Optional (recommended for hardened validation):
- APP_PROXY_MAX_AGE_SECONDS=300 rejects stale app-proxy requests older than the allowed skew
- ENABLE_TRUSTED_CUSTOMER_HEADER=true enables x-authenticated-customer-id trust for edge-authenticated setups

Optional (development fallback only):
- ALLOW_INSECURE_CUSTOMER_HEADER=true enables legacy x-shopify-customer-id header trust

Endpoints:
- GET /api/wishlist/session
  - Initializes a signed wishlist session and returns a CSRF token.
  - Customer identity is resolved from either:
    - trusted edge header: x-authenticated-customer-id
    - verified Shopify app proxy signature (query signature + logged_in_customer_id)
- GET /api/wishlist
  - Requires session cookie and X-CSRF-Token header.
  - Returns `{ wishlist: string[] }`.
- POST /api/wishlist
  - Requires session cookie and X-CSRF-Token header.
  - Body: `{ action: 'add'|'remove', item: string, handle?: string }`
  - Also supports bulk sync payload: `{ action: 'set', items: string[] }`
  - Adds, removes, or replaces items in the customer's wishlist metafield.

Security notes
- Session and CSRF cookies are generated server-side and validated for reads/writes.
- Rate limiting is applied to session and read/write routes.
- Do not expose this API without trusted identity propagation (edge header or app proxy).
