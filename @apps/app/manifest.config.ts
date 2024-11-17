import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name:
    env.mode === "staging"
      ? "[INTERNAL] Langsta Extension"
      : "Langsta Extension",
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  description: "Base Level Extension",
  permissions: [
    "contextMenus",
    "browsingData",
    "scripting",
    "nativeMessaging",
    "webNavigation",
    "storage",
    "tabs",
    "activeTab",
    "sidePanel",
  ],
  background: {
    service_worker: "src/background/service-worker.ts",
    type: "module",
  },
  content_scripts: [
    {
      js: ["src/foreground/content.ts"],
      matches: ["http://localhost/*", "<all_urls>"],
    },
  ],
  web_accessible_resources: [
    {
      matches: ["https://www.google.com/*"],
      resources: ["src/assets/*.png"],
    },
  ],
  icons: {
    "16": "logo/logo16.png",
    "48": "logo/logo48.png",
    "128": "logo/logo128.png",
  },
  action: {
    default_popup: "index.html",
    default_icon: {
      "16": "logo/logo16.png",
      "32": "logo/logo32.png",
      "24": "logo/logo24.png",
    },
  },
}));
