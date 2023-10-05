import OpenAI from "openai";
import { ContentMessageEventEmitter } from "../domain/content/ContentMessageEventEmitter";
import { GPTMessagesEventEmitter } from "../services/gpt-api/sendGPTRequest";
import { translateHander } from "./services/translate";

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_API_KEY || "", // defaults to process.env["OPENAI_API_KEY"]
  dangerouslyAllowBrowser: true,
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "defineSelection",
    title: "Define selection",
    contexts: ["all"],
  });
  chrome.tabs.create({ url: "page.html" });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "defineSelection") {
    // @ts-ignore
    chrome.sidePanel.open({ windowId: tab?.windowId });
  }
});

GPTMessagesEventEmitter.addListener(async (message) => {
  if (message.type === "gpt/translate") {
    translateHander(message);
  }
});

ContentMessageEventEmitter.addListener(async (message, sender) => {
  if (message.type === "define-selected-text") {
    try {
      // @ts-ignore
      await chrome.sidePanel.open({ tabId: sender.tab?.id });
      await chrome.sidePanel.setOptions({
        tabId: sender.tab?.id,
        path: "sidepanel.html",
        enabled: true,
      });
    } catch (error) {
      console.error(error);
    }
  }
});
