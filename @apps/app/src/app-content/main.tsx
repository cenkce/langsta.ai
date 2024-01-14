import React from "react";
import ReactDOM from "react-dom/client";
import { ContentApp } from "./ContentApp";
import { MantineCommonProvider } from "../app-common";

export function initializeApplication() {
  const container = document.createDocumentFragment();

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <MantineCommonProvider>
        <ContentApp />
      </MantineCommonProvider>
    </React.StrictMode>,
  );
}
