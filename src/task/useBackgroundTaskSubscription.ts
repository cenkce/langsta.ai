import { useEffect, useState } from "react";
import { TaskEventEmitter } from "./TaskMessage";
import { TaskStatus } from "./TaskStore";

export const useBackgroundTaskSubscription = (tag: string) => {
  const [status, setStatus] = useState<TaskStatus | undefined>();

  useEffect(() => {
    return TaskEventEmitter.addListener((message) => {
      console.log('message : ', message)
      if(message.type === 'task/update' && message.payload.tag?.includes(tag)){
        console.log('task updated ', message.payload);
        setStatus(message.payload.progress)
      }
    })
  }, [tag]);

  return status;
}
