import React from "react";
import ReactDOM from "react-dom/client";
import { SidepanelApp } from "./SidepanelApp";
import { RecoilRoot } from "recoil";
import { LocalstorageSyncProvider } from "../domain/storage/LocalstorageSync";
import ContentContextAtom from "../domain/content/ContentContext.atom";

ReactDOM.createRoot(document.getElementById("sidepanel-root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <LocalstorageSyncProvider debugKey="sidepanel"  storageAtom={ContentContextAtom}>
        <SidepanelApp />
      </LocalstorageSyncProvider>
    </RecoilRoot>
  </React.StrictMode>
);
