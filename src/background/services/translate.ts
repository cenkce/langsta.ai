import OpenAI from "openai";
import { TranslateRequestMessage } from "../../services/gpt-api/messages";
import { openai } from "../service-worker";
import {
  ContentContextState,
  ContentStorageList,
} from "../../domain/content/ContentContext.atom";
import { ContentStorage } from "../../domain/content/ContentStorage";
import { TaskStore } from "../../task/TaskStore";
import { from } from "rxjs";
import { TaskMessage } from "../../task/TaskMessage";

TaskStore.instance
  .subscribeTaskByTagName("background-task", [
    "idle",
    "error",
    "progress",
    "completed",
  ])
  .subscribe({
    next(task) {
      if (task) {

        TaskMessage({
          type: "task/update",
          payload: {
            progress: task?.status,
            tag: task?.params?.tags,
            taskId: task?.id,
          },
        });
      }
    },
    complete() {
      console.log("translate-service on back completed ");
    },
  });

export async function translateHander(message: TranslateRequestMessage) {
  const taskAtom = TaskStore.createTaskAtom(() => from(translate(message)), {
    tags: ["translate-service", "background-task"],
  });
  taskAtom.plugAtom$(taskAtom.chargeAtom$()).subscribe({
    next(result) {
      const storage = ContentStorage.of(ContentStorageList.contentContextAtom);
      result && storage?.write("translation", result);
    },
    error(err) {
      console.error(err);
    },
  });
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
    presence_penalty: 0,
  };
  const completion: OpenAI.Chat.ChatCompletion =
    await openai.chat.completions.create(params);

  return JSON.parse(
    completion.choices[0].message.content || ""
  ) as ContentContextState["translation"];
}
