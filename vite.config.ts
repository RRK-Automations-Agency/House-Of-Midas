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
          server.middlewares.use('/assets', async (req, res, next) => {
            const url = req.url?.split('?')[0] || '';
            const filePath = path.resolve(__dirname, 'assets', url.replace(/^\//, ''));
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
