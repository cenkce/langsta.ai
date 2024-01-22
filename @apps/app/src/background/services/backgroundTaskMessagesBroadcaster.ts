import { TaskStore } from "@espoojs/task";
import { TaskMessage } from "../../api/task/TaskMessage";
import { omit } from "ramda";

/**
 * Subscribes to task updates by tag name and emits task update messages to be subscribed from any environments.
 * 
 */
TaskStore.instance
  .subscribeTaskByTagName("background-task", [
    "idle",
    "error",
    "progress",
    "completed",
  ])
  .subscribe({
    next(task) {
      if (task) {
        const taskBody = omit(['task'], task);

        TaskMessage({
          type: "task/update",
          payload: {
            ...taskBody,
          },
        });
      }
    },
    error(err) {
      console.error(err);
    },
    complete() {
      console.debug("translate-service is completed");
    },
  });
