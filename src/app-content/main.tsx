import React from "react";
import ReactDOM from "react-dom/client";
import { ContentApp } from "./ContentApp";

export function initializeApplication(rootElement: HTMLElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ContentApp />
    </React.StrictMode>
  );
}
