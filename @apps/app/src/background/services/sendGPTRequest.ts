import { openai } from "../service-worker";
import { Observable } from "rxjs";
import { ChatCompletionChunk } from "openai/resources/index.mjs";
import { Stream } from "openai/streaming.mjs";
import OpenAI from "openai";

export function sendGPTRequest(message: {
  userMessage: string;
  systemMessage: string;
  stream?: boolean;
}) {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
messages: [
      { role: "system", content: message.systemMessage },
      { role: "user", content: message.userMessage },
    ],
    model: "gpt-3.5-turbo-16k",
    temperature: 1,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: message.stream !== undefined ? message.stream : true
  };
  const completion = openai.chat.completions.create(params);

  return new Observable<string>((subscriber) => {
    completion
      .then(async (stream) => {
        if(message.stream !== false)
          for await (const part of stream as unknown as Stream<ChatCompletionChunk>) {
            if (part.choices[0].delta?.content) {
              subscriber.next(part.choices[0].delta.content);
            }
          }
        else
          return (stream as OpenAI.Chat.Completions.ChatCompletion).choices[0].message.content;
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
