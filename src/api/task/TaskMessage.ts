import { ExtensionEventEmitter, MessageEvent } from "../core/MessageEvent";
import { TaskStatus } from "./TaskStore";

export type TaskUpdateMessage = {
  type: "task/update";
  payload: { taskId: string; progress: TaskStatus; tag?: string[] };
};
export const TaskMessage = (task: TaskUpdateMessage) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0].id) chrome.tabs.sendMessage(tabs[0].id, task);
  });
  chrome.runtime.sendMessage<TaskUpdateMessage>(task);
};
export const TaskEventEmitter = new ExtensionEventEmitter<
  MessageEvent<TaskUpdateMessage>
>(chrome.runtime.onMessage);
