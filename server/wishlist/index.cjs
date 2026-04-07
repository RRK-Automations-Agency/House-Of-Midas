/**
 * Wishlist API (Shopify metafield-backed)
 * - Avoids client-provided customer identity in API payloads.
 * - Uses signed session cookie + CSRF token for wishlist reads/writes.
 * - Returns generic client errors to avoid leaking backend internals.
 */
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json({ limit: '64kb' }));

const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const SIGNING_SECRET = process.env.WISHLIST_SIGNING_SECRET || 'replace-me-in-production';
const APP_PROXY_SECRET = process.env.SHOPIFY_APP_PROXY_SECRET || process.env.SHOPIFY_API_SECRET || '';
const TRUSTED_CUSTOMER_HEADER = 'x-authenticated-customer-id';
const ENABLE_TRUSTED_CUSTOMER_HEADER = process.env.ENABLE_TRUSTED_CUSTOMER_HEADER === 'true';
const ALLOW_INSECURE_CUSTOMER_HEADER = process.env.ALLOW_INSECURE_CUSTOMER_HEADER === 'true';
const APP_PROXY_MAX_AGE_SECONDS = Number.isFinite(Number(process.env.APP_PROXY_MAX_AGE_SECONDS))
  ? Math.max(30, Number(process.env.APP_PROXY_MAX_AGE_SECONDS))
  : 300;
const NORMALIZED_SHOP_DOMAIN = normalizeShopDomain(SHOP_DOMAIN);

if (!SHOP_DOMAIN || !ADMIN_TOKEN) {
  console.warn('SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_TOKEN is not set. The wishlist API will not work until these are provided.');
}
if (SIGNING_SECRET === 'replace-me-in-production') {
  console.warn('WISHLIST_SIGNING_SECRET is not set. Set this in production to a strong random value.');
}
if (ENABLE_TRUSTED_CUSTOMER_HEADER) {
  console.warn('ENABLE_TRUSTED_CUSTOMER_HEADER is enabled. Ensure edge middleware strips untrusted header values.');
}
if (ALLOW_INSECURE_CUSTOMER_HEADER) {
  console.warn('ALLOW_INSECURE_CUSTOMER_HEADER is enabled. This should be used only for short-lived development fallback.');
}
if (!APP_PROXY_SECRET) {
  console.warn('SHOPIFY_APP_PROXY_SECRET is not set. App proxy signature verification will be unavailable.');
}

const MF_NAMESPACE = 'hom';
const MF_KEY = 'wishlist';
const SESSION_COOKIE = 'hom_wishlist_session';
const CSRF_COOKIE = 'hom_wishlist_csrf';

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  const proto = String(req.headers['x-forwarded-proto'] || '').toLowerCase();
  const isSecure = req.secure || proto === 'https';
  if (isSecure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

function isValidCustomerId(value) {
  return /^\d+$/.test(String(value || ''));
}

function normalizeShopDomain(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*/, '');
}

function safeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

function hmac(value) {
  return crypto.createHmac('sha256', SIGNING_SECRET).update(String(value)).digest('hex');
}

function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};
  return header.split(';').reduce((acc, part) => {
    const i = part.indexOf('=');
    if (i === -1) return acc;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    acc[k] = decodeURIComponent(v);
    return acc;
  }, {});
}

function normalizeQueryValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry));
  }
  if (value === undefined || value === null) return [];
  return [String(value)];
}

function computeAppProxySignature(query) {
  const pairs = [];
  Object.keys(query || {})
    .filter((key) => key !== 'signature')
    .sort()
    .forEach((key) => {
      normalizeQueryValue(query[key]).forEach((value) => {
        pairs.push(`${key}=${value}`);
      });
    });
  return crypto.createHmac('sha256', APP_PROXY_SECRET).update(pairs.join('')).digest('hex');
}

function getAppProxyCustomerId(req) {
  if (!APP_PROXY_SECRET) return null;

  const signature = String(req.query?.signature || '').trim();
  const customerId = String(req.query?.logged_in_customer_id || '').trim();
  const shop = normalizeShopDomain(req.query?.shop || '');
  const timestamp = Number(req.query?.timestamp || NaN);

  if (!signature || !isValidCustomerId(customerId)) return null;
  if (!shop || !NORMALIZED_SHOP_DOMAIN || shop !== NORMALIZED_SHOP_DOMAIN) return null;
  if (!Number.isFinite(timestamp)) return null;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > APP_PROXY_MAX_AGE_SECONDS) return null;

  const expected = computeAppProxySignature(req.query || {});
  if (!safeEqual(signature, expected)) return null;

  return customerId;
}

function getTrustedCustomerId(req) {
  const proxyCustomerId = getAppProxyCustomerId(req);
  if (proxyCustomerId) return proxyCustomerId;

  if (ENABLE_TRUSTED_CUSTOMER_HEADER) {
    const trusted = String(req.headers[TRUSTED_CUSTOMER_HEADER] || '').trim();
    if (isValidCustomerId(trusted)) return trusted;
  }

  if (ALLOW_INSECURE_CUSTOMER_HEADER) {
    const legacy = String(req.headers['x-shopify-customer-id'] || '').trim();
    if (isValidCustomerId(legacy)) return legacy;
  }

  return null;
}

function setWishlistSessionCookies(res, customerId) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const signedPayload = `${customerId}.${nonce}`;
  const sessionValue = `${signedPayload}.${hmac(signedPayload)}`;
  const csrfToken = hmac(`csrf:${signedPayload}`);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', [
    `${SESSION_COOKIE}=${encodeURIComponent(sessionValue)}; Path=/; HttpOnly; SameSite=Lax${secure}`,
    `${CSRF_COOKIE}=${encodeURIComponent(csrfToken)}; Path=/; SameSite=Lax${secure}`,
  ]);
  return csrfToken;
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req);
  const raw = cookies[SESSION_COOKIE];
  if (!raw) return null;

  const [customerId, nonce, signature] = String(raw).split('.');
  if (!isValidCustomerId(customerId) || !nonce || !signature) return null;

  const signedPayload = `${customerId}.${nonce}`;
  const expected = hmac(signedPayload);
  if (!safeEqual(signature, expected)) return null;

  return { customerId: String(customerId), nonce: String(nonce) };
}

function getCsrfTokenForSession(session) {
  return hmac(`csrf:${session.customerId}.${session.nonce}`);
}

function isValidCsrf(req, session) {
  const provided = String(req.headers['x-csrf-token'] || '');
  const expected = getCsrfTokenForSession(session);
  const csrfCookie = String(parseCookies(req)[CSRF_COOKIE] || '');
  if (!safeEqual(csrfCookie, expected)) return false;
  if (!safeEqual(provided, expected)) return false;
  return true;
}

function sanitizeWishlist(input) {
  if (!Array.isArray(input)) return [];
  const values = input
    .filter((entry) => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0 && entry.length <= 255)
    .slice(0, 200);

  return Array.from(new Set(values));
}

const rateState = new Map();

function getClientIp(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.ip || req.socket?.remoteAddress || 'unknown';
}

function createRateLimiter({ windowMs, max, scope }) {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${scope}:${getClientIp(req)}`;
    const current = rateState.get(key);

    if (!current || now > current.resetAt) {
      rateState.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= max) {
      res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000));
      return res.status(429).json({ error: 'Too many requests' });
    }

    current.count += 1;
    return next();
  };
}

const wishlistSessionRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 20, scope: 'wishlist-session' });
const wishlistReadWriteRateLimiter = createRateLimiter({ windowMs: 60 * 1000, max: 60, scope: 'wishlist-api' });

async function adminRequest(path, options = {}) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2023-10${path}`;
  const headers = Object.assign({
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': ADMIN_TOKEN,
  }, options.headers || {});

  const res = await fetch(url, Object.assign({}, options, { headers }));
  if (!res.ok) {
    const bodyText = await res.text();
    const err = new Error('Shopify admin request failed');
    err.status = res.status;
    err.internal = bodyText;
    throw err;
  }
  return res.json();
}

async function readWishlistMetafield(customerId) {
  const path = `/customers/${customerId}/metafields.json?namespace=${MF_NAMESPACE}&key=${MF_KEY}`;
  const data = await adminRequest(path, { method: 'GET' });
  if (!data.metafields || data.metafields.length === 0) return [];
  const mf = data.metafields[0];
  try {
    return sanitizeWishlist(JSON.parse(mf.value || '[]'));
  } catch (_) {
    return [];
  }
}

async function writeWishlistMetafield(customerId, arr) {
  const safeList = sanitizeWishlist(arr);
  const findPath = `/customers/${customerId}/metafields.json?namespace=${MF_NAMESPACE}&key=${MF_KEY}`;
  const found = await adminRequest(findPath, { method: 'GET' });
  if (found.metafields && found.metafields.length > 0) {
    const mf = found.metafields[0];
    const updatePath = `/customers/${customerId}/metafields/${mf.id}.json`;
    const body = { metafield: { id: mf.id, value: JSON.stringify(safeList), type: 'json' } };
    return adminRequest(updatePath, { method: 'PUT', body: JSON.stringify(body) });
  }

  const createPath = `/customers/${customerId}/metafields.json`;
  const body = { metafield: { namespace: MF_NAMESPACE, key: MF_KEY, value: JSON.stringify(safeList), type: 'json' } };
  return adminRequest(createPath, { method: 'POST', body: JSON.stringify(body) });
}

// Initializes signed session + csrf token.
app.get('/api/wishlist/session', wishlistSessionRateLimiter, (req, res) => {
  const customerId = getTrustedCustomerId(req);
  if (!customerId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const csrfToken = setWishlistSessionCookies(res, customerId);
  return res.json({ csrfToken });
});

app.get('/api/wishlist', wishlistReadWriteRateLimiter, async (req, res) => {
  try {
    const session = getSessionFromRequest(req);
    if (!session || !isValidCsrf(req, session)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const arr = await readWishlistMetafield(session.customerId);
    return res.json({ wishlist: arr });
  } catch (err) {
    console.error('[wishlist:get]', err.status || 500, err.internal || err.message);
    return res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

app.post('/api/wishlist', wishlistReadWriteRateLimiter, async (req, res) => {
  try {
    const session = getSessionFromRequest(req);
    if (!session || !isValidCsrf(req, session)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const action = String(req.body?.action || '');

    if (action === 'set') {
      const submitted = Array.isArray(req.body?.items)
        ? req.body.items.map((value) => String(value || ''))
        : [];
      const next = sanitizeWishlist(submitted);
      await writeWishlistMetafield(session.customerId, next);
      return res.json({ wishlist: next });
    }

    const rawItem = String(req.body?.item || '');
    const rawHandle = String(req.body?.handle || '');
    const wishlistKey = (rawHandle || rawItem).trim();

    if (!/^(add|remove)$/.test(action) || !wishlistKey || wishlistKey.length > 255) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const current = await readWishlistMetafield(session.customerId);
    let next = current.slice();
    if (action === 'add') {
      if (!next.includes(wishlistKey)) next.push(wishlistKey);
    } else {
      next = next.filter((i) => i !== wishlistKey);
    }

    await writeWishlistMetafield(session.customerId, next);
    return res.json({ wishlist: next });
  } catch (err) {
    console.error('[wishlist:post]', err.status || 500, err.internal || err.message);
    return res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

app.get('/api/health', (_req, res) => res.json({
  ok: true,
  appProxyVerification: Boolean(APP_PROXY_SECRET),
  trustedHeader: ENABLE_TRUSTED_CUSTOMER_HEADER,
  proxyMaxAgeSeconds: APP_PROXY_MAX_AGE_SECONDS,
}));


if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Wishlist API listening on port ${port}`));
}

module.exports = app;
