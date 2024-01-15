import {
  ContentContextState,
  ContentStorage
} from "../../domain/content/ContentContext.atom";
import { ContentTask } from "../../api/task/ContentTask";


export async function upsertContentTask(update: Partial<ContentTask>) {
  if (!update.taskId) return;
  try {
    const taskStates = await ContentStorage?.read("translation");
    const newTaskStates = taskStates[update.taskId]
      ? ({
        ...taskStates,
        [update.taskId]: { ...taskStates[update.taskId], ...update },
      } as ContentContextState["translation"])
      : ({
        ...taskStates,
        [update.taskId]: { ...update },
      } as ContentContextState["translation"]);
    await ContentStorage.write("translation", newTaskStates);
  } catch (error) {
    console.error(error);
  }
}
