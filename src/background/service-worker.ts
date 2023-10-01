import OpenAI from "openai";
import { ContentMessageEventEmitter } from "../domain/content/ContentMessageEventEmitter";
import { TranslateRequestMessage } from "../services/gpt-api/messages";
import { GPTMessagesEventEmitter } from "../services/gpt-api/sendGPTRequest";

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

export async function translate(message: TranslateRequestMessage) {
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

GPTMessagesEventEmitter.addListener(async (message, sender) => {
  console.log('contentMessagesEmitter : ', message, sender.tab?.id);
  if(message.type === 'gpt/translate'){
      try {
        const result = await translate(message);

        console.log(result);
      } catch (error) {
        console.error(error);
      }
  }
})


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
