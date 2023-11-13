import { TaskStatus } from "./TaskStore";


export type TranslationTextTask = {
  selectedText: string;
  taskId?: string;
  result?: string;
  error?: string;
  status: TaskStatus;
  createdAt: number;
};
