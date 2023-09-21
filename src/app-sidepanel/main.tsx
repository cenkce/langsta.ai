import React from "react";
import ReactDOM from "react-dom/client";
import { SidepanelApp } from "./SidepanelApp";
import { RecoilRoot } from "recoil";
import { LocalstorageSync } from "../domain/storage/LocalstorageSync";

ReactDOM.createRoot(document.getElementById("sidepanel-root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <LocalstorageSync>
        <SidepanelApp />
      </LocalstorageSync>
    </RecoilRoot>
  </React.StrictMode>
);
