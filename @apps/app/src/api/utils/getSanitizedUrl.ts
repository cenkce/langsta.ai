import { sanitizeUtmUrl } from "@espoojs/utils";

export function getSanitizedUrl() {
  return sanitizeUtmUrl(window.location.href);
}