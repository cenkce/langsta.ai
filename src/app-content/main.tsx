import React from "react";
import ReactDOM from "react-dom/client";
import { ContentApp } from "./ContentApp";
import './Content.scss';

export function initializeApplication() {
  const container = document.createDocumentFragment();
  // const root = createRoot(container);
  // root.render(content);
  // const container = document.createElement("div");
  // const shadowRoot = container.attachShadow({ mode: "open" });
  // rootElement.appendChild(container)

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <ContentApp />
    </React.StrictMode>
  );
}
