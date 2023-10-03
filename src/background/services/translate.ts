import OpenAI from "openai";
import { TranslateRequestMessage } from "../../services/gpt-api/messages";
import { openai } from "../service-worker";
import { ContentContextState, ContentStorageList } from "../../domain/content/ContentContext.atom";
import { ContentStorage } from "../../domain/content/ContentStorage";


export async function translateHander(message: TranslateRequestMessage) {
  let result: ContentContextState["translation"] | undefined;
    try {
      result = await translate(message);
    } catch (error) {
      console.error(error);
    } finally {
      const storage = ContentStorage.of(
        ContentStorageList.contentContextAtom
      );
      result &&
        await storage?.write("translation", result);
    }
}

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
  const completion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);

  return JSON.parse(completion.choices[0].message.content || '') as ContentContextState['translation'];
}
