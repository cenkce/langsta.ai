import { MessageEventEmitter } from "../core/MessageEvent";
import type { ParsedContentType } from "./parseContent";

export type ExtractTabContentMessage = {
  type: 'extract-tab-content',
  payload: ParsedContentType
};

export type DefineSelectedTextMessage = {
  type: 'define-selected-text',
  payload: string
};

export type ContentContextMessages = ExtractTabContentMessage | DefineSelectedTextMessage;

export const emitContentMessage = chrome.runtime.sendMessage<ContentContextMessages>;

export const contentMessagesEmitter = new MessageEventEmitter<ContentContextMessages>();
