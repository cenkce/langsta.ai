import { ExtensionEventEmitter, MessageEvent } from "../../core/MessageEvent";
import { ContentContextMessages } from "./messages";


export const ContentMessageEventEmitter = new ExtensionEventEmitter<MessageEvent<ContentContextMessages>>(chrome.runtime.onMessage);