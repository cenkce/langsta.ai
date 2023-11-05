import React from "react";
import ReactDOM from "react-dom/client";
import { ContentApp } from "./ContentApp";

export function initializeApplication() {
  const container = document.createDocumentFragment();

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <ContentApp />
    </React.StrictMode>
  );
}
