import React from "react";
import ReactDOM from "react-dom/client";
import { ContentApp } from "./ContentApp";
import { RecoilRoot } from "recoil";
import { RecoilSync } from "recoil-sync";
import { ContentContextSubscriber } from "../domain/content/ContentContext.atom";

export function initializeApplication(rootElement: HTMLElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RecoilRoot override={true}>
        <RecoilSync storeKey="common-store">
          <ContentContextSubscriber />
          <ContentApp />
        </RecoilSync>
      </RecoilRoot>
    </React.StrictMode>
  );
}
