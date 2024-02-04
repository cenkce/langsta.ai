import type { ParsedContentType } from "../../app-content/parseTabPageContent";

export type ExtractTabContentMessage = {
  type: 'extract-tab-content',
  payload: ParsedContentType
};

export type DefineSelectedTextMessage = {
  type: 'define-selected-text'
};

export type OpenSidePanelMessage = {
  type: 'open-side-panel'
};

export type OpenReadModePanelMessage = {
  type: 'open-study-mode-side-panel'
};

export type DeleteTask = {
  type: 'backend/delete-task',
  payload: {
    task: string
  }
};

export type ServiceWorkerContentMessages = OpenReadModePanelMessage | ExtractTabContentMessage | DefineSelectedTextMessage | DeleteTask | OpenSidePanelMessage;

export const serviceWorkerContentMessageDispatch = chrome.runtime.sendMessage<ServiceWorkerContentMessages>;