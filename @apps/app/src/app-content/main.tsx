import { TabMessages } from "../domain/content/TabMessages";
import { parseTabPageContent } from "./parseTabPageContent";
import React from "react";
import ReactDOM from "react-dom/client";
import { ContentApp } from "./ContentApp";
import { MantineCommonProvider } from "../app-common";
import { ContentContextAtom } from "../domain/content/ContentContext.atom";
import { sanitizeUtmUrl } from "@espoojs/utils";

chrome.runtime.onMessage.addListener((message: TabMessages) => {
  if(message.type === "get-page-content") {
    const state = ContentContextAtom.getValue();
    const url = sanitizeUtmUrl(window.location.href);
    ContentContextAtom.set$({
      activeTabContent: {
        ...state.activeTabContent,
        [url]: parseTabPageContent(window.document) || undefined,
      },
      activeTabUrl: sanitizeUtmUrl(window.location.href),
    })
  }
});

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
