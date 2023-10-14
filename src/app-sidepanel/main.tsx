import React from "react";
import ReactDOM from "react-dom/client";
import { SidepanelApp } from "./SidepanelApp";
import { RecoilRoot } from "recoil";
import { LocalstorageSyncProvider } from "../api/storage/LocalstorageSync";
import { ContentContextAtom, ContentStorage } from "../domain/content/ContentContext.atom";

ReactDOM.createRoot(document.getElementById("sidepanel-root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <LocalstorageSyncProvider
        debugKey="sidepanel"
        storageAtom={ContentContextAtom}
        contentStorage={ContentStorage}
      >
        <SidepanelApp />
      </LocalstorageSyncProvider>
    </RecoilRoot>
  </React.StrictMode>
);
