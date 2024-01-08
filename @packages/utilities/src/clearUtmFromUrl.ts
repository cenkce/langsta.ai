function isUtm(param: string) {
  return param.slice(0, 4) === "utm_";
}

export const clearUtmFromUrl = (url?: URL) => {
  if (!url) {
    throw "Empty url string provided";
  }

  url.searchParams?.forEach(
    (_, key) => isUtm(key) && url.searchParams.delete(key)
  );

  return url;
};

export const clearHashFromUrl = (url?: URL) => {
  if (!url) {
    throw "Empty url string provided";
  }
  url.hash = "";

  url.searchParams?.forEach(
    (_, key) => isUtm(key) && url.searchParams.delete(key)
  );

  return url;
};

export function sanitizeUtmUrl(url: string): string {
  const urlins = new URL(url)

  clearUtmFromUrl(urlins);
  clearHashFromUrl(urlins);

  return urlins.toString();
}