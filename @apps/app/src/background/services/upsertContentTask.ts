import {
  ContentContextState,
  ContentStorage
} from "../../domain/content/ContentContext.atom";
import { ContentTask } from "../../api/task/ContentTask";

export async function upsertContentTask(update: Partial<ContentTask>) {
  if (!update.taskId) return;
  try {
    console.log("update : ", update)
    const taskStates = await ContentStorage?.read("contentTasks") || {};
    const newTaskStates = taskStates[update.taskId]
      ? ({
        ...taskStates,
        [update.taskId]: { ...taskStates[update.taskId], ...update },
      } as ContentContextState["contentTasks"])
      : ({
        ...taskStates,
        [update.taskId]: { ...update },
      } as ContentContextState["contentTasks"]);
    await ContentStorage.write("contentTasks", newTaskStates);
  } catch (error) {
    console.error(error);
  }
}
