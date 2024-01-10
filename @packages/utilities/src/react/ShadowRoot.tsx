import { FC, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

// based from : https://medium.com/outreach-prague/develop-chrome-extensions-using-react-typescript-and-shadow-dom-1e112935a735
export const ShadowDom: FC<{
  parentElement: Element | null;
  position?: InsertPosition;
  mode: "open" | "closed";
  children: React.ReactNode;
  id?: string;
}> = ({
  parentElement,
  mode = "open",
  children,
  id = "extension-app-shadow-host",
}) => {
  const [shadowHost] = useState(() => document.createElement(id));
  shadowHost.id = id;

  const [shadowRoot] = useState(() => shadowHost.attachShadow({ mode }));

  useLayoutEffect(() => {
    if (parentElement) {
      parentElement.appendChild(shadowHost);
    }
    return () => {
      shadowHost.remove();
    };
  }, [parentElement, shadowHost]);

  return createPortal(children, shadowRoot);
};
