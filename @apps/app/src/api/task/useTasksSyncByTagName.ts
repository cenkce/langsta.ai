import { useEffect } from "react";
import { TaskEventEmitter } from "./TaskMessage";
import { TaskStore } from "@espoojs/task";
import { of } from "rxjs";

export const useTasksSyncByTagName = (tag: string) => {
  useEffect(() => {
    return TaskEventEmitter.addListener((message) => {
      if (
        message.type === "task/update" &&
        message.payload.params?.tags?.includes(tag)
      ) {
        if(!TaskStore.instance.hasNode(message.payload.id)) {
          TaskStore.instance.createNode({
            ...message.payload,
            task: () => of()
          });
        } else {
          TaskStore.instance.updateNode(message.payload.id, message.payload);
        }
      }
    });
  }, [tag]);
};
