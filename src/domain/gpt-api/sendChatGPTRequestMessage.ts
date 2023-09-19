import { CompletionRequestMessage } from "./CompletionRequestMessage";

export const sendChatGPTRequestMessage = chrome.runtime.sendMessage<CompletionRequestMessage>;
