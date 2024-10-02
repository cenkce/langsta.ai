import react from "@vitejs/plugin-react";
import { PluginOption, defineConfig } from "vite";
import { ManifestV3Export, crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.config";
import eslint from "vite-plugin-eslint";
import { resolve } from 'path';

export const isDev = process.env.NODE_ENV !== "production";

export const cssrefresher = () =>
  ({
    // from https://github.com/crxjs/chrome-extension-tools/discussions/239
    name: "merge-css-shadow-dom",
    enforce: "post",
    apply: "serve",
    transform(src, id) {
      if (/\.(tsx).*$/.test(id) || /\.(scss).*$/.test(id)) {
        const fn =
          "import { updateStyle, removeStyle } from '/script/utils.ts';\n";
        let updatedSrc = fn + src;
        updatedSrc = updatedSrc.replace("__vite__updateStyle(", "updateStyle(");
        updatedSrc = updatedSrc.replace("__vite__removeStyle(", "removeStyle(");
        return {
          code: updatedSrc,
        };
      }
    },
  }) as PluginOption;
export default defineConfig({
  plugins: [
    react({ include: ["**/*.tsx", "**/*.ts", "**/*.scss"] }),
    crx({ manifest: manifest as ManifestV3Export }),
    eslint(),
    cssrefresher(),
    // this plugin removes base style tag.
  ],
  build: {
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, "sidepanel.html"),
        "sidepanel-study-mode.html": resolve(__dirname, "sidepanel-study-mode.html")
      },
    },
    minify: "terser",
  },
  css: {
    modules: {
      generateScopedName: "[name]__[local]--[hash:base64:5]",
    },
  },
  define: {
    __DEV__: isDev,
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
