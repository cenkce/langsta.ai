import React, { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

// =================================================================>
// from https://github.com/crxjs/chrome-extension-tools/pull/755
/*
import { type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'

export const createElement = <T extends Element>(template: string) => {
  return new Range().createContextualFragment(template).firstElementChild as unknown as T
}

export interface RootOptions {
  mode?: ShadowRootMode
  style?: string
  script?: string
  element?: Element
}

const createShadowRoot = (
  name: string,
  options: RootOptions
): Root & { shadowHost: Element; shadowRoot: ShadowRoot; appRoot: Element } => {
  const { mode = 'open', style = '', script = '', element = '' } = options ?? {}
  const shadowHost = createElement(`<${name}></${name}>`)
  const shadowRoot = shadowHost.attachShadow({ mode })
  const appRoot = createElement(`<div id="app"></div>`)
  const appStyle = style && createElement(`<style type="text/css">${style}</style>`)
  const appScript = script && createElement(`<script type="application/javascript">${script}</script>`)
  const reactRoot = createRoot(appRoot)

  shadowRoot.append(appStyle, appRoot, appScript, element)

  return {
    shadowHost,
    shadowRoot,
    appRoot,
    render: (children: ReactNode) => {
      document.body.appendChild(shadowHost)
      return reactRoot.render(children)
    },
    unmount: () => {
      reactRoot.unmount()
      shadowHost.remove()
    }
  }
}

export default createShadowRoot
// <================================
 */


// based from : https://medium.com/outreach-prague/develop-chrome-extensions-using-react-typescript-and-shadow-dom-1e112935a735
export function ShadowDom({
  parentElement,
  position = "beforebegin",
  mode = "open",
  children,
}: {
  parentElement: Element | null;
  position?: InsertPosition;
  mode: "open" | "closed" ;
  children: React.ReactNode;
}) {
  const [shadowHost] = useState(() =>
    document.createElement("extension-app-shadow-host")
  );

  const [shadowRoot] = useState(() =>
    shadowHost.attachShadow({ mode })
  );

  useLayoutEffect(() => {
    if (parentElement) {
      parentElement.appendChild(shadowHost);
    }
    return () => {
      shadowHost.remove();
    };
  }, [parentElement, shadowHost, position]);

  return ReactDOM.createPortal(children, shadowRoot);
}
