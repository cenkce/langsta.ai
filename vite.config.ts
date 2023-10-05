import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { ManifestV3Export, crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [eslint(), react(), crx({ manifest: manifest as ManifestV3Export})],
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,
    },
  }
});
