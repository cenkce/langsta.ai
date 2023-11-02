import React, { useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";

// from : https://medium.com/outreach-prague/develop-chrome-extensions-using-react-typescript-and-shadow-dom-1e112935a735
export function ShadowDom({
  parentElement,
  position = "beforebegin",
  children,
}: {
  parentElement: Element | null;
  position?: InsertPosition;
  children: React.ReactNode;
}) {
  const [shadowHost] = useState(() =>
    document.createElement("app-shadow-host")
  );

  const [styles] = useState(() =>
    document.getElementsByTagName('style')
  );

  const [shadowRoot] = useState(() =>
    shadowHost.attachShadow({ mode: "open" })
  );

  useLayoutEffect(() => {
    if (parentElement) {
      parentElement.appendChild(shadowHost);
    }

    const style = styles.item(styles.length - 1)
    style && shadowRoot.appendChild(style);

    return () => {
      shadowHost.remove();
    };
  }, [parentElement, shadowHost, position]);

  return ReactDOM.createPortal(children, shadowRoot);
}
