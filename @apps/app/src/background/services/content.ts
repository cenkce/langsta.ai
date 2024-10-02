import { sendOpenAIGPTRequest } from "./sendGPTRequest";
import { omit } from "ramda";
import {
  ExtractWordsRequestMessage,
  SimplyfyRequestMessage,
  SummariseContentRequestMessage,
} from "../../api/services/gpt-api/messages";
import { TaskStore } from "@espoojs/task";

export const GPTContentRequest = async (
  message:
    | SummariseContentRequestMessage
    | SimplyfyRequestMessage
    | ExtractWordsRequestMessage,
) => {
  const messageBody = omit(["id"], message);
  const task = await sendOpenAIGPTRequest({
    userMessage: messageBody.userMessage,
    systemMessage: messageBody.systemMessage,
    stream: messageBody.stream,
    content: messageBody.content,
  });
  const taskAtom = TaskStore.createTaskAtom(
    () => task,
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
