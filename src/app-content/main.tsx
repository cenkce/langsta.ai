import React from "react";
import ReactDOM from "react-dom/client";
import { ContentApp } from "./ContentApp";
import { RecoilRoot } from "recoil";

export function initializeApplication(rootElement: HTMLElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RecoilRoot>
        <ContentApp />
      </RecoilRoot>
    </React.StrictMode>
  );
}
