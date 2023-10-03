import React from "react";
import ReactDOM from "react-dom/client";
import { SidepanelApp } from "./SidepanelApp";
import { RecoilRoot } from "recoil";
import { LocalstorageSyncProvider } from "../domain/storage/LocalstorageSync";
import { ContentContextAtom, ContentStorageList } from "../domain/content/ContentContext.atom";
import { ContentStorage } from "../domain/content/ContentStorage";
const contentStorage = new ContentStorage(ContentStorageList.contentContextAtom);
ReactDOM.createRoot(document.getElementById("sidepanel-root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <LocalstorageSyncProvider
        debugKey="sidepanel"
        storageAtom={ContentContextAtom}
        contentStorage={contentStorage}
      >
        <SidepanelApp />
      </LocalstorageSyncProvider>
    </RecoilRoot>
  </React.StrictMode>
);
