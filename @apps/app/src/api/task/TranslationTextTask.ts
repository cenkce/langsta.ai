import type { TranslateRequestMessage } from "../services/gpt-api/messages";
import type { TaskStatus } from "@espoojs/task";


export type TranslationTextTask = {
  selection: TranslateRequestMessage['content'];
  taskId?: string;
  result?: string;
  error?: string;
  status: TaskStatus;
  createdAt: number;
};
