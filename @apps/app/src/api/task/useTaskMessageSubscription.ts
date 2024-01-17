import { useEffect, useState } from "react";
import { TaskEventEmitter } from "./TaskMessage";
import { TaskStatus } from "@espoojs/task";

/**
 * Subscribes to task updates by tag name.
 * 
 * @TODO it is useless because all environments can subscribe to task updates using content-store syncronization using useLocalstorageSync.
 * Maybe I can remove this hook or improve storing all tasks tagged with specific tag name.
 * 
 * @returns 
 */
export const useTaskMessageSubscription = (tag: string) => {
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
