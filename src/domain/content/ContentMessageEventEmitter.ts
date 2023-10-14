import { ExtensionEventEmitter, MessageEvent } from "../../api/core/MessageEvent";
import { ContentContextMessages } from "./messages";


export const ContentMessageEventEmitter = new ExtensionEventEmitter<MessageEvent<ContentContextMessages>>(chrome.runtime.onMessage);
