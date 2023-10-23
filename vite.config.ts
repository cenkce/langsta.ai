import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ManifestV3Export, crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [
    react({ include: ["**/*.tsx", "**/*.scss"] }),
    crx({ manifest: manifest as ManifestV3Export }),
    eslint(),
  ],
  css: {
    modules: {
      generateScopedName: "[name]__[local]--[hash:base64:5]",
    }
  },
  server: {
    watch: {
      usePolling: true,
    },
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  },
});
