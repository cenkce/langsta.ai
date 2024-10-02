import { ApiConnect } from "../service-worker";
import { Observable } from "rxjs";
import { Stream } from "openai/streaming.mjs";
import OpenAI from "openai";
import { SettingsStorage } from "../../domain/user/SettingsModel";
import Groq from "groq-sdk";
import { ChatCompletionChunk } from "groq-sdk/resources/chat/completions.mjs";

export async function sendOpenAIGPTRequest(message: {
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
          { type: "text", text: message.content || "" },
        ],
      },
      // { role: "user", content:  },
    ],
    model: "gpt-4-turbo-2024-04-09",
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
        else {
          const response =
            stream as unknown as OpenAI.Chat.Completions.ChatCompletion;
          return subscriber.next(response.choices[0].message.content || '');
        }
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

let groq: Groq;

export async function sendLlamaRequest(message: {
  userMessage: string;
  systemMessage: string;
  content?: string;
  stream?: boolean;
}) {
  // const apiKey = await SettingsStorage.read("apiKey");
  // const service = new LlamaAI(
  //   apiKey,
  //   "https://wig6i7ioya0b9vfv.us-east-1.aws.endpoints.huggingface.cloud",
  // );
  const apiKey = await SettingsStorage.read("apiKey");

  if (!groq) groq = new Groq({ apiKey: apiKey });
  // const params: OpenAI.Chat.ChatCompletionCreateParams = ;

  return new Observable<string>((subscriber) => {
    const completion = groq.chat.completions.create({
      messages: [
        { role: "system", content: message.systemMessage },
        {
          role: "user",
          content: [
            { type: "text", text: message.userMessage },
            { type: "text", text: message.content || "" },
          ],
        },
        // { role: "user", content:  },
      ],
      model: "llama3-70b-8192",
      // temperature: 1,
      // top_p: 0.6,
      // frequency_penalty: 0,
      // presence_penalty: 0,
      stream: message.stream !== undefined ? message.stream : true,
    });

    completion
      .then(async (stream) => {
        if (message.stream !== false)
          for await (const part of stream as unknown as Stream<ChatCompletionChunk>) {
            if (part.choices[0].delta?.content) {
              subscriber.next(part.choices[0].delta.content);
            }
          }
        else
          subscriber.next(
            (stream as Groq.Chat.Completions.ChatCompletion).choices[0].message
              .content || "",
          );
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
