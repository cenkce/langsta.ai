import OpenAI from "openai";
import { ContentMessageEventEmitter } from "../domain/content/ContentMessageEventEmitter";
import { GPTMessagesEventEmitter } from "../api/services/gpt-api/sendGPTRequest";
import { GPTTranslateRequest } from "./services/translate";
// import { createTranslateTextMessage } from "../domain/translation/TranslationService";
import { openSidePanel } from "../api/helper/openSidePanel";
import { TaskStore } from "@espoojs/task";
import { GPTContentRequest } from "./services/content";
import "./services/backgroundTaskMessagesBroadcaster";

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_API_KEY || "", // defaults to process.env["OPENAI_API_KEY"]
  dangerouslyAllowBrowser: true,
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ path: 'side-panel.html' });
  chrome.contextMenus.create({
    id: "wordsplorer",
    title: "Wordsplorer",
    contexts: ["all"],
  });
  chrome.contextMenus.create({
    id: "wordsplorer-defineSelection",
    parentId: "wordsplorer",
    title: "Translate selection",
    contexts: ["selection"]
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
  } else if (message.type === "gpt/simplify" || message.type === "gpt/summarise") {
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
      openSidePanel(sender.tab?.id, 'sidepanel-study-mode.html');
    } catch (error) {
      console.error(error);
    }
  }
   else if (message.type === "define-selected-text") {
    try {
      openSidePanel(sender.tab?.id);
    } catch (error) {
      console.error(error);
    }
  } else if(message.type === 'backend/delete-task') {
    // @TODO: Doesn't work yet
    TaskStore.cancelTask(message.payload.task);
  }
});
