import {
  ExtensionEventEmitter,
  MessageEvent,
} from "../../api/core/MessageEvent";
import { ServiceWorkerContentMessages } from "./messages";

export const ContentMessageEventEmitter = new ExtensionEventEmitter<
  MessageEvent<ServiceWorkerContentMessages>
>(chrome.runtime.onMessage);
