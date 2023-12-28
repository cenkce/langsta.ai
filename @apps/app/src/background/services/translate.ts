import OpenAI from "openai";
import { TranslateRequestMessage } from "../../api/services/gpt-api/messages";
import { openai } from "../service-worker";
import {
  ContentContextState,
  ContentStorage,
} from "../../domain/content/ContentContext.atom";
import { TranslationTextTask } from "../../api/task/TranslationTextTask";
import { TaskStore } from "../../api/task/TaskStore";
import { from } from "rxjs";
import { TaskMessage } from "../../api/task/TaskMessage";
import { clone } from "ramda";

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: taskId, task: taskNode, ...rest } = task;
        TaskMessage({
          type: "task/update",
          payload: {
            taskId,
            ...rest,
          },
        });
      }
    },
    error(err) {
      console.error(err);
    },
    complete() {
      console.debug("translate-service is completed");
    },
  });

async function upsertTranslationTask(update: Partial<TranslationTextTask>) {
  if (!update.taskId) return;
  try {
    const taskStates = await ContentStorage?.read("translation");
    const newTaskStates = taskStates[update.taskId]
      ? ({
          ...taskStates,
          [update.taskId]: { ...taskStates[update.taskId], ...update },
        } as ContentContextState["translation"])
      : ({
          ...taskStates,
          [update.taskId]: { ...update },
        } as ContentContextState["translation"]);
    await ContentStorage.write("translation", newTaskStates);
  } catch (error) {
    console.error(error);
  }
}

export async function translateHander(message: TranslateRequestMessage) {
  const { id, ...messageBody } = message;
  console.log(message)
  const taskAtom = TaskStore.createTaskAtom(
    () => from(translate({userMessage: messageBody.content.text, systemMessage: messageBody.systemMessage})),
    {
      tags: ["translate-service", "background-task"],
      selection: clone(messageBody.content.selectors)
    },
    id
  );

  await upsertTranslationTask({
    selection: message.content,
    status: "progress",
    taskId: taskAtom.id,
    createdAt: taskAtom.createdAt,
  });

  taskAtom.plugAtom$(taskAtom.chargeAtom$()).subscribe({
    next(result) {
      result &&
        upsertTranslationTask({
          selection: message.content,
          status: "completed",
          taskId: taskAtom.id,
          result: result,
        });
    },
    complete() {},
    error(err) {
      console.error(err);
      upsertTranslationTask({
        selection: message.content,
        status: "error",
        taskId: taskAtom.id,
        error: err,
      });
    },
  });
}

export async function translate(message: {userMessage: string, systemMessage: string}) {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      { role: "system", content: message.systemMessage },
      { role: "user", content: message.userMessage },
    ],
    model: "gpt-3.5-turbo-16k",
    temperature: 0,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };
  try {
    const completion: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params);
    // return JSON.parse(completion.choices[0].message.content || "") as string;
    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error(error);
    return "";
  }
}
