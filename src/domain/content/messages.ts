import type { ParsedContentType } from "./parseContent";

export type ExtractTabContentMessage = {
  type: 'extract-tab-content',
  payload: ParsedContentType
};

export type DefineSelectedTextMessage = {
  type: 'define-selected-text'
};

export type DeleteTask = {
  type: 'backend/delete-task',
  payload: {
    task: string
  }
};

export type ContentContextMessages = ExtractTabContentMessage | DefineSelectedTextMessage | DeleteTask;

export const ContentMessageDispatch = chrome.runtime.sendMessage<ContentContextMessages>;