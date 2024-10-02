import { TranslateRequestMessage } from "../../api/services/gpt-api/messages";
import {
  UserContentState,
  ContentStorage,
} from "../../domain/content/ContentContext.atom";
import { TranslationTextTask } from "../../api/task/TranslationTextTask";
import { TaskStore } from "@espoojs/task";
import { clone } from "ramda";
import { sendLlamaRequest } from "./sendGPTRequest";

async function upsertTranslationTask(update: Partial<TranslationTextTask>) {
  if (!update.taskId) return;
  try {
    const taskStates = (await ContentStorage?.read("translation")) || {};
    const newTaskStates = taskStates[update.taskId]
      ? ({
          ...taskStates,
          [update.taskId]: { ...taskStates[update.taskId], ...update },
        } as UserContentState["translation"])
      : ({
          ...taskStates,
          [update.taskId]: { ...update },
        } as UserContentState["translation"]);
    await ContentStorage.write("translation", newTaskStates);
  } catch (error) {
    console.error(error);
  }
}

export async function GPTTranslateRequest(message: TranslateRequestMessage) {
  const { id, ...messageBody } = message;
  const task = await sendLlamaRequest({
    userMessage: messageBody?.content?.text || "",
    systemMessage: messageBody.systemMessage,
  });
  const taskAtom = TaskStore.createTaskAtom(
    () => task,
    {
      tags: ["translate-service", "background-task"],
      selection: messageBody?.content?.selectors
        ? clone(messageBody.content.selectors)
        : "",
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
      if (result)
        upsertTranslationTask({
          selection: message.content,
          taskId: taskAtom.id,
          result: result,
        });
    },
    complete() {
      upsertTranslationTask({
        status: "completed",
      });
    },
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
