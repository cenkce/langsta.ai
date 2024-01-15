import { from } from "rxjs";
import { sendGPTRequest } from "./sendGPTRequest";
import { omit } from "ramda";
import {
  SimplyfyRequestMessage,
  SummariseContentRequestMessage,
} from "../../api/services/gpt-api/messages";
import { TaskStore } from "@espoojs/task";
import { upsertContentTask } from "./upsertContentTask";

export const GPTContentRequest = async (
  message: SummariseContentRequestMessage | SimplyfyRequestMessage,
) => {
  const messageBody = omit(["id"], message);
  console.log("translateHander : ", message);
  const taskAtom = TaskStore.createTaskAtom(
    () =>
      from(
        sendGPTRequest({
          userMessage: messageBody.content,
          systemMessage: messageBody.systemMessage,
        }),
      ),
    {
      tags: ["translate-service", "background-task"],
      type: message.type
    },
    message.id,
  );

  await upsertContentTask({
    content: message.content,
    status: "progress",
    taskId: taskAtom.id,
    createdAt: taskAtom.createdAt,
  });

  taskAtom.plugAtom$(taskAtom.chargeAtom$()).subscribe({
    next(result) {
      result &&
        upsertContentTask({
          status: "completed",
          taskId: taskAtom.id,
          result: result,
        });
    },
    complete() {},
    error(err) {
      console.error(err);
      upsertContentTask({
        status: "error",
        taskId: taskAtom.id,
        error: err,
      });
    },
  });
};
