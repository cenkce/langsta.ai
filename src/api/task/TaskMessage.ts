import { ExtensionEventEmitter, MessageEvent } from "../core/MessageEvent";
import { TaskStatus } from "./TaskStore";

export type TaskUpdateMessage = {
  type: "task/update";
  payload: { taskId: string; progress: TaskStatus; tag?: string[] };
};
export const TaskMessage = (task: TaskUpdateMessage) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]?.id) chrome.tabs.sendMessage(tabs[0].id, task).catch(console.error);
  });
  chrome.runtime.sendMessage<TaskUpdateMessage>(task).catch(console.error);
};
export const TaskEventEmitter = new ExtensionEventEmitter<
  MessageEvent<TaskUpdateMessage>
>(chrome.runtime.onMessage);
