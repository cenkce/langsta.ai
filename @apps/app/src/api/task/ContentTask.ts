import type { TaskStatus } from "@espoojs/task";

export type ContentTask = {
  content: string;
  taskId?: string;
  result?: string;
  error?: string;
  status: TaskStatus;
  createdAt: number;
};
