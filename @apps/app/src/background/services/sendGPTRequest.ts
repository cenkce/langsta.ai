import OpenAI from "openai";
import { openai } from "../service-worker";


export async function sendGPTRequest(message: {
  userMessage: string;
  systemMessage: string;
}) {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      { role: "system", content: message.systemMessage },
      { role: "user", content: message.userMessage },
    ],
    model: "gpt-3.5-turbo-16k",
    temperature: 0,
    max_tokens: 1024 * 6,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };
  try {
    const completion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
    // return JSON.parse(completion.choices[0].message.content || "") as string;
    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error(error);
    return "";
  }
}
