import { TranslateRequestMessage } from "../../api/services/gpt-api/messages";
import {
  ContentContextState,
  ContentStorage,
} from "../../domain/content/ContentContext.atom";
import { TranslationTextTask } from "../../api/task/TranslationTextTask";
import { TaskStore } from "@espoojs/task";
import { clone } from "ramda";
import { sendGPTRequest } from "./sendGPTRequest";

async function upsertTranslationTask(update: Partial<TranslationTextTask>) {
  if (!update.taskId) return;
  try {
    const taskStates = (await ContentStorage?.read("translation")) || {};
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

export async function GPTTranslateRequest(message: TranslateRequestMessage) {
  const { id, ...messageBody } = message;
  console.log("translateHander : ", message);
  const taskAtom = TaskStore.createTaskAtom(
    () =>
      sendGPTRequest({
        userMessage: messageBody.content.text,
        systemMessage: messageBody.systemMessage,
      }),
    {
      tags: ["translate-service", "background-task"],
      selection: clone(messageBody.content.selectors),
    },
    id,
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
