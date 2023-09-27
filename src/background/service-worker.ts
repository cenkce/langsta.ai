import OpenAI from "openai";
import { CompletionRequestMessage } from "../services/gpt-api/CompletionRequestMessage";
import { ContentMessageEventEmitter } from "../domain/content/ContentMessageEventEmitter";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_API_KEY || "", // defaults to process.env["OPENAI_API_KEY"]
  dangerouslyAllowBrowser: true,
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'defineSelection',
    title: 'Define selection',
    contexts: ['all']
  });
  chrome.tabs.create({ url: 'page.html' });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'defineSelection') {
    // @ts-ignore
    chrome.sidePanel.open({ windowId: tab?.windowId });
  }
});

export async function sendCompletionRequest(message: CompletionRequestMessage) {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      { role: "system", content: message.systemMessage },
      { role: "user", content: message.content },
    ],
    model: "gpt-3.5-turbo",
    temperature: 0,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  };
  const completion: OpenAI.Chat.ChatCompletion =
    await openai.chat.completions.create(params);

  return completion;
}

ContentMessageEventEmitter.addListener(async (message, sender) => {
  console.log('contentMessagesEmitter : ', message, sender.tab?.id);
  if(message.type === 'define-selected-text'){
      try {
        // @ts-ignore
        await chrome.sidePanel.open({ tabId: sender.tab?.id });
        await chrome.sidePanel.setOptions({
          tabId: sender.tab?.id,
          path: 'sidepanel.html',
          enabled: true
        });
      } catch (error) {
        console.error(error);
      }
  }
})
