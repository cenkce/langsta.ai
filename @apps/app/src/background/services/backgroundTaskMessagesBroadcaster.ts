import { TaskStore } from "@espoojs/task";
import { TaskMessage } from "../../api/task/TaskMessage";
import { omit } from "ramda";
import { bufferTime, filter } from "rxjs";

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
  .pipe(
    bufferTime(200),
    filter((tasks) => tasks.length > 0)
  )
  .subscribe({
    next(tasks) {
      if (tasks && tasks?.length) {
        const taskBody = tasks.filter(task => task !== null).map((task) => omit(['task'], task));

        TaskMessage({
          type: "task/update",
          payload: taskBody
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