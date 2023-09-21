import React from "react";
import ReactDOM from "react-dom/client";
import { ContentApp } from "./ContentApp";
import { RecoilRoot } from "recoil";
import { LocalstorageSync } from "../domain/storage/LocalstorageSync";

export function initializeApplication(rootElement: HTMLElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <RecoilRoot>
        <LocalstorageSync>
          <ContentApp />
        </LocalstorageSync>
      </RecoilRoot>
    </React.StrictMode>
  );
}
