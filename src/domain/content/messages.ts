import type { ParsedContentType } from "./parseContent";

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

export type DeleteTask = {
  type: 'backend/delete-task',
  payload: {
    task: string
  }
};

export type ServiceWorkerContentMessages = ExtractTabContentMessage | DefineSelectedTextMessage | DeleteTask | OpenSidePanelMessage;

export const serviceWorkerContentMessageDispatch = chrome.runtime.sendMessage<ServiceWorkerContentMessages>;