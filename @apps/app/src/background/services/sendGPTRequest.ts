import OpenAI from "openai";
import { openai } from "../service-worker";
import { Observable } from "rxjs";

export function sendGPTRequest(message: {
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
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  };
  const completion = openai.chat.completions.create(params);

  return new Observable<string>((subscriber) => {
    completion
      .then(async (stream) => {
        for await (const part of stream) {
          if (part.choices[0].delta?.content) {
            subscriber.next(part.choices[0].delta.content);
          }
        }
      })
      .catch((error) => {
        subscriber.error(error);
      })
      .finally(() => {
        subscriber.complete();
      });
  });
}
