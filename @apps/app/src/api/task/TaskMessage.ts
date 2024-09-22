import { ExtensionEventEmitter, MessageEvent } from "../core/MessageEvent";
import { TaskNode } from "@espoojs/task";

export type TaskUpdate = Omit<TaskNode, 'task'>;
export type TaskUpdateMessage = {
  type: "task/update";
  payload: TaskUpdate[];
};
/**
 * Emits task update messages to the background, sidebars, frontend and content applications.
 * Tasks can be created in any application, but other applications can't get the task informations directly from the task store,
 * because every application has own context and the taskstore instance. This is why we need to emit task updates to every application.
 *
 * @param task
 */
export const TaskMessage = (task: TaskUpdateMessage) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]?.id)
      chrome.tabs.sendMessage(tabs[0].id, task).catch(console.error);
  });
  chrome.runtime.sendMessage<TaskUpdateMessage>(task).catch(console.error);
};
export const TaskEventEmitter = new ExtensionEventEmitter<
  MessageEvent<TaskUpdateMessage>
>(chrome.runtime.onMessage);
