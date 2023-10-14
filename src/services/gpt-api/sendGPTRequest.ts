import { ExtensionEventEmitter, MessageEvent} from "../../api/core/MessageEvent";
import { GPTMessages } from "./messages";

export const sendGPTRequest = chrome.runtime.sendMessage<GPTMessages>;
export const GPTMessagesEventEmitter = new ExtensionEventEmitter<MessageEvent<GPTMessages>>(chrome.runtime.onMessage);
