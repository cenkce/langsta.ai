function getId(id: string): string {
  // @ts-expect-error
  return id.split("/").slice(-3).join('__').replaceAll('.', '_');
}
// influenced from https://github.com/farazshuja/chrome-extension-vite-vue-starter-template/blob/master/src/contentScripts/utils.ts
export function updateStyle(id: string, content: string) {
  const root = document.getElementsByTagName('extension-app-shadow-host')[0];
  const shadowEl = root?.shadowRoot;
  const newId = getId(id);
  let style = shadowEl?.querySelector(`style#${newId}`);
  if (style && !(style instanceof HTMLStyleElement)) {
    removeStyle(id);
    style = null;
  }
  if (!style) {
    style = document.createElement('style');
    style.id = newId;
    style.setAttribute('type', 'text/css');
    style?.setAttribute('data-vite-dev-id', id);

    style.innerHTML = content;
    if (window.location.href.includes('chrome-extension://')) {
      document.head.appendChild(style);
    } else {

      // if no root try again in a second
      if (!root) {
        setTimeout(() => updateStyle(id, content), 1000);
        return;
      }
      const shadowEl = root?.shadowRoot;
      shadowEl?.appendChild(style);
    }
  } else {
    style?.setAttribute('data-vite-dev-id', id);
    style.innerHTML = content;
  }
}

export function removeStyle(id: string) {
  const newId = getId(id);  
  const root = document.getElementsByTagName('extension-app-shadow-host')[0];
  const shadowEl = root?.shadowRoot;
  const style = shadowEl?.querySelector(`style#${newId}`);
  if (style) {
    if (window.location.href.includes('chrome-extension://')) {
      if (style instanceof CSSStyleSheet) {
        (document as any).adoptedStyleSheets = (
          document as any
        ).adoptedStyleSheets.filter((s: any) => s !== style);
      } else {
        document.head.removeChild(style);
      }
    } else {
      const root = document.getElementsByTagName('extension-app-shadow-host')[0];
      const shadowEl: any = root?.shadowRoot;
      if (style instanceof CSSStyleSheet) {
        if (shadowEl) {
          shadowEl.adoptedStyleSheets = shadowEl.adoptedStyleSheets.filter(
            (s: any) => s !== style,
          );
        }
      } else if (shadowEl) {
        shadowEl.removeChild(style);
      }
    }
  }
}