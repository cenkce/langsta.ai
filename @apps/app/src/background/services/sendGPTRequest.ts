import { ApiConnect } from "../service-worker";
import { Observable } from "rxjs";
import { ChatCompletionChunk } from "openai/resources/index.mjs";
import { Stream } from "openai/streaming.mjs";
import OpenAI from "openai";
import { SettingsStorage } from "../../domain/user/SettingsModel";

export async function sendGPTRequest(message: {
  userMessage: string;
  systemMessage: string;
  content?: string;
  stream?: boolean;
}) {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      { role: "system", content: message.systemMessage },
      {
        role: "user",
        content: [
          { type: "text", text: message.userMessage },
          { type: "text", text: message.content || '' },
        ],
      },
      // { role: "user", content:  },
    ],
    model: "gpt-4-turbo",
    temperature: 0.6,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: message.stream !== undefined ? message.stream : true,
  };

  const apiKey = await SettingsStorage.read("apiKey");

  return new Observable<string>((subscriber) => {
    const completion = ApiConnect.connect({ apiKey }).chat.completions.create(
      params,
    );

    completion
      .then(async (stream) => {
        if (message.stream !== false)
          for await (const part of stream as unknown as Stream<ChatCompletionChunk>) {
            if (part.choices[0].delta?.content) {
              subscriber.next(part.choices[0].delta.content);
            }
          }
        else
          return (stream as OpenAI.Chat.Completions.ChatCompletion).choices[0]
            .message.content;
      })
      .catch((error) => {
        subscriber.error(error);
      })
      .finally(() => {
        console.debug("task finally");
        subscriber.complete();
      });
  });
}
