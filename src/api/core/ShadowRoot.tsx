import React, { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

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
