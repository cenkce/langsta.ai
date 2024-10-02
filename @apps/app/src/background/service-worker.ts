import OpenAI from "openai";
import { ContentMessageEventEmitter } from "../domain/content/ContentMessageEventEmitter";
import { GPTMessagesEventEmitter } from "../api/services/gpt-api/sendGPTRequest";
import { GPTTranslateRequest } from "./services/translate";
// import { createTranslateTextMessage } from "../domain/translation/TranslationService";
import { openSidePanel } from "../api/helper/openSidePanel";
import { TaskStore } from "@espoojs/task";
import { GPTContentRequest } from "./services/content";
import "./services/backgroundTaskMessagesBroadcaster";
import { SettingsStorage } from "../domain/user/SettingsModel";

export class ApiConnect {
  private static apiKey?: string = '';
  private static sdk = new OpenAI({ apiKey: ApiConnect.apiKey });
  static connect({baseUrl, apiKey}: {baseUrl?: string, apiKey?: string }) {
    if (baseUrl) this.sdk.baseURL = baseUrl;
    if (apiKey) this.sdk.apiKey = apiKey;
    return this.sdk;
  }

  static {
    SettingsStorage.subscribe((settings) => {
      if (settings.apiKey) this.apiKey = settings.apiKey.newValue;
    });
  }

  protected constructor() {}
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ path: "side-panel.html" });
  chrome.contextMenus.create({
    id: "wordsplorer",
    title: "Wordsplorer",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "wordsplorer-defineSelection",
    parentId: "wordsplorer",
    title: "Translate selection",
    contexts: ["selection"],
  });
});

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === "wordsplorer-defineSelection") {
//     info.selectionText && translateHander(createTranslateTextMessage(info.selectionText));
//     // @ts-ignore
//     chrome.sidePanel.open({ windowId: tab?.windowId });
//   }
// });

GPTMessagesEventEmitter.addListener(async (message) => {
  if (message.type === "gpt/translate") {
    GPTTranslateRequest(message);
  } else if (
    message.type === "gpt/words" ||
    message.type === "gpt/simplify" ||
    message.type === "gpt/summary"
  ) {
    GPTContentRequest(message);
  }
});

ContentMessageEventEmitter.addListener(async (message, sender) => {
  if (message.type === "open-side-panel") {
    try {
      openSidePanel(sender.tab?.id);
    } catch (error) {
      console.error(error);
    }
  } else if (message.type === "open-study-mode-side-panel") {
    try {
      openSidePanel(sender.tab?.id, "sidepanel-study-mode.html");
    } catch (error) {
      console.error(error);
    }
  } else if (message.type === "define-selected-text") {
    try {
      openSidePanel(sender.tab?.id);
    } catch (error) {
      console.error(error);
    }
  } else if (message.type === "backend/delete-task") {
    // @TODO: Doesn't work yet
    TaskStore.cancelTask(message.payload.task);
  }
});
