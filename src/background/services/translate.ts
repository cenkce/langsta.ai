import OpenAI from "openai";
import { TranslateRequestMessage } from "../../services/gpt-api/messages";
import { openai } from "../service-worker";
import {
  ContentStorage,
  TranslationTextTask,
} from "../../domain/content/ContentContext.atom";
import { TaskStore } from "../../api/task/TaskStore";
import { from } from "rxjs";
import { TaskMessage } from "../../api/task/TaskMessage";

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
    error(err) {
      console.error(err);
    },
    complete() {
      console.debug("translate-service is completed");
    },
  });

async function upsertTranslationTask(update: TranslationTextTask) {
  if (!update.taskId) return;
  try {
    const taskStates = await ContentStorage?.read("translation");
    const newTaskStates = taskStates[update.taskId]
      ? {
          ...taskStates,
          [update.taskId]: { ...taskStates[update.taskId], ...update },
        }
      : { ...taskStates, [update.taskId]: { ...update } };
    await ContentStorage.write("translation", newTaskStates);
  } catch (error) {
    console.error(error);
  }
}

export async function translateHander(message: TranslateRequestMessage) {
  
  const taskAtom = TaskStore.createTaskAtom(() => from(translate(message)), {
    tags: ["translate-service", "background-task"],
  });
  
  await upsertTranslationTask({
    selectedText: message.content,
    status: "progress",
    taskId: taskAtom.id,
  });


  taskAtom.plugAtom$(taskAtom.chargeAtom$()).subscribe({
    next(result) {
      result &&
        upsertTranslationTask({
          selectedText: message.content,
          status: "completed",
          taskId: taskAtom.id,
          result: result,
        });
    },
    complete() {},
    error(err) {
      console.error(err);
      upsertTranslationTask({
        selectedText: message.content,
        status: "progress",
        taskId: taskAtom.id,
        error: err,
      });
    },
  });
}

export async function translate(message: TranslateRequestMessage) {
  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    messages: [
      { role: "system", content: message.systemMessage },
      { role: "user", content: message.content },
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
