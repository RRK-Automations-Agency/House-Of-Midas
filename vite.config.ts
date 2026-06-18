import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import fs from "fs";

async function loadOptionalMiaodaPlugin() {
  try {
    const mod = await import("miaoda-sc-plugin");
    if (typeof mod.miaodaDevPlugin === "function") {
      return mod.miaodaDevPlugin();
    }
  } catch (_err) {
    // Optional dependency: allow build to continue when plugin is unavailable.
  }
  return null;
}

// https://vite.dev/config/
export default defineConfig(async () => {
  const maybeMiaodaPlugin = await loadOptionalMiaodaPlugin();

  return {
    base: "",
    plugins: [
      react(),
      ...(maybeMiaodaPlugin ? [maybeMiaodaPlugin] : []),
      svgr({
        svgrOptions: {
          icon: true,
          exportType: "named",
          namedExport: "ReactComponent",
        },
      }),
      {
        name: 'serve-assets',
        configureServer(server) {
          // Stateful mock cart
          let mockCart = {
            item_count: 0,
            items: [],
            total_price: 0
          };

          const MOCK_VARIANTS = {
            "1-yg-5": { id: "1-yg-5", product_title: "Celestial Oval Ring", variant_title: "Yellow Gold / 5", price: 12000000, image: "/assets/1000128422.png", handle: "celestial-oval-ring" },
            "1-yg-6": { id: "1-yg-6", product_title: "Celestial Oval Ring", variant_title: "Yellow Gold / 6", price: 12000000, image: "/assets/1000128422.png", handle: "celestial-oval-ring" },
            "1-yg-7": { id: "1-yg-7", product_title: "Celestial Oval Ring", variant_title: "Yellow Gold / 7", price: 12000000, image: "/assets/1000128422.png", handle: "celestial-oval-ring" },
            "1-yg-8": { id: "1-yg-8", product_title: "Celestial Oval Ring", variant_title: "Yellow Gold / 8", price: 12000000, image: "/assets/1000128422.png", handle: "celestial-oval-ring" },
            "1-wg-6": { id: "1-wg-6", product_title: "Celestial Oval Ring", variant_title: "White Gold / 6", price: 12500000, image: "/assets/1000128422.png", handle: "celestial-oval-ring" },
            "1-rg-6": { id: "1-rg-6", product_title: "Celestial Oval Ring", variant_title: "Rose Gold / 6", price: 12200000, image: "/assets/1000128422.png", handle: "celestial-oval-ring" },
            "2-wg-5": { id: "2-wg-5", product_title: "Eternal Radiance Ring", variant_title: "White Gold / 5", price: 25000000, image: "/assets/1000128450.png", handle: "eternal-radiance-ring" },
            "2-wg-6": { id: "2-wg-6", product_title: "Eternal Radiance Ring", variant_title: "White Gold / 6", price: 25000000, image: "/assets/1000128450.png", handle: "eternal-radiance-ring" },
            "2-wg-7": { id: "2-wg-7", product_title: "Eternal Radiance Ring", variant_title: "White Gold / 7", price: 25000000, image: "/assets/1000128450.png", handle: "eternal-radiance-ring" },
            "2-wg-8": { id: "2-wg-8", product_title: "Eternal Radiance Ring", variant_title: "White Gold / 8", price: 25000000, image: "/assets/1000128450.png", handle: "eternal-radiance-ring" },
            "3-rg-6": { id: "3-rg-6", product_title: "Majestic Solitaire Ring", variant_title: "Rose Gold / 6", price: 8500000, image: "/assets/1000128452.png", handle: "majestic-solitaire-ring" },
            "3-rg-7": { id: "3-rg-7", product_title: "Majestic Solitaire Ring", variant_title: "Rose Gold / 7", price: 8500000, image: "/assets/1000128452.png", handle: "majestic-solitaire-ring" },
            "3-rg-8": { id: "3-rg-8", product_title: "Majestic Solitaire Ring", variant_title: "Rose Gold / 8", price: 8500000, image: "/assets/1000128452.png", handle: "majestic-solitaire-ring" },
            "4-yg-6": { id: "4-yg-6", product_title: "Golden Heritage Ring", variant_title: "Yellow Gold / 6", price: 4500000, image: "/assets/1000128454.png", handle: "golden-heritage-ring" },
            "4-yg-7": { id: "4-yg-7", product_title: "Golden Heritage Ring", variant_title: "Yellow Gold / 7", price: 4500000, image: "/assets/1000128454.png", handle: "golden-heritage-ring" },
            "4-yg-8": { id: "4-yg-8", product_title: "Golden Heritage Ring", variant_title: "Yellow Gold / 8", price: 4500000, image: "/assets/1000128454.png", handle: "golden-heritage-ring" },
            "5-wg-6": { id: "5-wg-6", product_title: "Aura Diamond Ring", variant_title: "White Gold / 6", price: 11000000, image: "/assets/1000128456.png", handle: "aura-diamond-ring" },
            "5-wg-7": { id: "5-wg-7", product_title: "Aura Diamond Ring", variant_title: "White Gold / 7", price: 11000000, image: "/assets/1000128456.png", handle: "aura-diamond-ring" },
            "6-rg-6": { id: "6-rg-6", product_title: "Grandeur Signature Ring", variant_title: "Rose Gold / 6", price: 9500000, image: "/assets/1000128458.png", handle: "grandeur-signature-ring" },
            "7-yg-6": { id: "7-yg-6", product_title: "Luminous Brilliance Ring", variant_title: "Yellow Gold / 6", price: 13500000, image: "/assets/1000128460.png", handle: "luminous-brilliance-ring" },
            "8-wg-6": { id: "8-wg-6", product_title: "Artisan Heritage Ring", variant_title: "White Gold / 6", price: 18000000, image: "/assets/1000128462.png", handle: "artisan-heritage-ring" },
            "9-rg-6": { id: "9-rg-6", product_title: "Royal Midas Ring", variant_title: "Rose Gold / 6", price: 7500000, image: "/assets/1000128464.png", handle: "royal-midas-ring" }
          };

          function updateCartTotals() {
            mockCart.item_count = mockCart.items.reduce((sum, item) => sum + item.quantity, 0);
            mockCart.total_price = mockCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          }

          function getRequestBody(req) {
            return new Promise((resolve) => {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
              });
              req.on('end', () => {
                try {
                  resolve(body ? JSON.parse(body) : {});
                } catch (e) {
                  resolve({});
                }
              });
            });
          }

          // Intercept Shopify API Cart endpoints
          server.middlewares.use(async (req, res, next) => {
            const url = req.url || '';
            const pathPart = url.split('?')[0];

            if (pathPart === '/cart.js' && req.method === 'GET') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(mockCart));
              return;
            }

            if (pathPart === '/cart/add.js' && req.method === 'POST') {
              const body = await getRequestBody(req);
              const itemsToAdd = body.items || [{ id: body.id, quantity: body.quantity || 1 }];
              for (const item of itemsToAdd) {
                const variantId = String(item.id);
                const qty = Number(item.quantity) || 1;
                const variant = MOCK_VARIANTS[variantId];
                if (variant) {
                  const existing = mockCart.items.find(x => x.id === variantId);
                  if (existing) {
                    existing.quantity += qty;
                    existing.line_price = existing.price * existing.quantity;
                  } else {
                    mockCart.items.push({
                      id: variantId,
                      key: variantId,
                      title: `${variant.product_title} - ${variant.variant_title}`,
                      price: variant.price,
                      line_price: variant.price * qty,
                      quantity: qty,
                      image: variant.image,
                      handle: variant.handle,
                      variant_id: variantId,
                      product_title: variant.product_title,
                      variant_title: variant.variant_title,
                      url: `/products/${variant.handle}`
                    });
                  }
                }
              }
              updateCartTotals();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(mockCart));
              return;
            }

            if (pathPart === '/cart/change.js' && req.method === 'POST') {
              const body = await getRequestBody(req);
              const variantId = String(body.id);
              const qty = Number(body.quantity);
              if (qty === 0) {
                mockCart.items = mockCart.items.filter(x => x.id !== variantId);
              } else {
                const existing = mockCart.items.find(x => x.id === variantId);
                if (existing) {
                  existing.quantity = qty;
                  existing.line_price = existing.price * qty;
                }
              }
              updateCartTotals();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(mockCart));
              return;
            }

            // Mock standard Search endpoint to silence 404
            if (pathPart === '/search') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify([])); // triggers fallback to mock-data.ts gracefully without 404 console errors
              return;
            }

            // Mock collections products JSON to silence 404
            if (pathPart === '/collections/all/products.json') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ products: [] }));
              return;
            }

            next();
          });

          // Serve flattened assets and ring sequence frames
          server.middlewares.use(async (req, res, next) => {
            const url = req.url?.split('?')[0] || '';
            const isAssetRequest = req.url?.startsWith('/assets/') || 
                                   url.endsWith('.png') || 
                                   url.endsWith('.jpg') || 
                                   url.endsWith('.jpeg') || 
                                   url.endsWith('.svg') || 
                                   url.endsWith('.mp4');

            if (!isAssetRequest) {
              return next();
            }

            let assetName = url.split('/').pop() || '';
            
            // If it's a sequence frame Num.jpg requested directly (like 1.jpg, 2.jpg)
            // we should try ring-Num.jpg since our flatten script uses `ring-Num.jpg`
            if (url.match(/\/\d+\.jpg$/) || url.match(/^\d+\.jpg$/)) {
              assetName = `ring-${assetName}`;
            }

            const filePath = path.resolve(__dirname, 'assets', assetName);
            try {
              const content = await fs.promises.readFile(filePath);
              const ext = path.extname(filePath).toLowerCase();
              const contentType = ext === '.png' ? 'image/png' 
                : ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
                : ext === '.svg' ? 'image/svg+xml'
                : ext === '.mp4' ? 'video/mp4'
                : ext === '.js' ? 'application/javascript'
                : ext === '.css' ? 'text/css'
                : 'application/octet-stream';
              res.setHeader('Content-Type', contentType);
              res.end(content);
            } catch (err) {
              next();
            }
          });
        }
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "assets",
      assetsDir: "",
      rollupOptions: {
        output: {
          entryFileNames: "index.js",
          // Shopify theme assets are easiest to deploy reliably with a single JS entry.
          inlineDynamicImports: true,
          manualChunks: undefined,
          assetFileNames: "[name].[ext]",
        },
      },
      emptyOutDir: false,
    },
  };
});
