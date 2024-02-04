import { sendGPTRequest } from "./sendGPTRequest";
import { omit } from "ramda";
import {
  ExtractWordsRequestMessage,
  SimplyfyRequestMessage,
  SummariseContentRequestMessage,
} from "../../api/services/gpt-api/messages";
import { TaskStore } from "@espoojs/task";

export const GPTContentRequest = async (
  message: SummariseContentRequestMessage | SimplyfyRequestMessage | ExtractWordsRequestMessage,
) => {
  const messageBody = omit(["id"], message);
  const taskAtom = TaskStore.createTaskAtom(
    () =>
      sendGPTRequest({
        userMessage: messageBody.content,
        systemMessage: messageBody.systemMessage,
        stream: messageBody.stream,
      }),
    {
      tags: ["content-service", "background-task", message.type],
      type: message.type,
    },
    message.id,
  );

  taskAtom.plugAtom$(taskAtom.chargeAtom$()).subscribe({
    error(err) {
      console.error(err);
    },
  });
};
