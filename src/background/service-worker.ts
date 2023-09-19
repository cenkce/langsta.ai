import OpenAI from "openai";
import { CompletionRequestMessage } from "../domain/gpt-api/CompletionRequestMessage";
import { contentMessagesEmitter } from "../domain/content/messages";

const openai = new OpenAI({
  apiKey: "", // defaults to process.env["OPENAI_API_KEY"]
  dangerouslyAllowBrowser: true,
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

contentMessagesEmitter.addListener(async (message, sender) => {
  console.log('contentMessagesEmitter : ', message);
  if(message.type === 'define-selected-text'){
      await chrome.sidePanel.setOptions({
        tabId: sender.tab?.id,
        path: 'sidepanel.html',
        enabled: true
      });
  }
})

// chrome.runtime.onMessage.addListener(
//   async (message: CompletionRequestMessage, sender, sendResponse) => {
//     console.log('contentMessagesEmitter : ', message);
//     if (message.type === "completion-request") {
//       const response = await sendCompletionRequest(message);
//       console.log(response);
//       sendResponse(response);
//       return true;
//     }
//   }
// );
