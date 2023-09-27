import type { ParsedContentType } from "./parseContent";

export type ExtractTabContentMessage = {
  type: 'extract-tab-content',
  payload: ParsedContentType
};

export type DefineSelectedTextMessage = {
  type: 'define-selected-text'
};

export type ContentContextMessages = ExtractTabContentMessage | DefineSelectedTextMessage;

export const emitContentMessage = chrome.runtime.sendMessage<ContentContextMessages>;