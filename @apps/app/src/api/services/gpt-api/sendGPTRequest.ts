import { ExtensionEventEmitter, MessageEvent} from "../../core/MessageEvent";
import { GPTApiRequestMessages } from "./messages";

export const sendGPTRequest = chrome.runtime.sendMessage<GPTApiRequestMessages>;
export const GPTMessagesEventEmitter = new ExtensionEventEmitter<MessageEvent<GPTApiRequestMessages>>(chrome.runtime.onMessage);
