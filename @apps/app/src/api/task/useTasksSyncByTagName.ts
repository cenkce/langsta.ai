import { useEffect } from "react";
import { TaskEventEmitter } from "./TaskMessage";
import { TaskStore } from "@espoojs/task";
import { of } from "rxjs";

export const useTasksSyncByTagName = (tag: string) => {
  useEffect(() => {
    return TaskEventEmitter.addListener((messages) => {
      if (
        messages.type === "task/update" &&
        messages.payload.filter(
          (message) => message.params?.tags?.includes(tag),
        )
      ) {
        messages.payload.map((task) => {
          if (!TaskStore.instance.hasNode(task.id)) {
            TaskStore.instance.createNode({
              ...task,
              task: () => of(),
            });
          } else {
            TaskStore.instance.updateNode(task.id, task);
          }
        });
      }
    });
  }, [tag]);
};
