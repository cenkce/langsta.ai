import { useEffect, useState } from "react";
import { TaskEventEmitter } from "./TaskMessage";
import { TaskStatus } from "@espoojs/task";

export const useBackgroundTaskSubscription = (tag: string) => {
  const [status, setStatus] = useState<TaskStatus | undefined>();

  useEffect(() => {
    return TaskEventEmitter.addListener((message) => {
      if (
        message.type === "task/update" &&
        message.payload.tag?.includes(tag)
      ) {
        console.debug("task/update : ", message);
        setStatus(message.payload.status);
      }
    });
  }, [tag]);

  return status;
};
