import { useCallback, useMemo } from "react";
import { Task, TaskParams, TaskStore } from "./TaskStore";

export const useTask = () => {
  return useCallback((task: Task, params?: TaskParams) => {
      return TaskStore.createTaskAtom(task, params);
  }, []);
}

export const useTaskSubscribeById = (id: string) => {
  return useMemo(() => {
    return TaskStore.instance.subscribeTaskById(id);
  }, [id])
}

export const useTaskSubscribeByTag = (tag: string) => {
  return useMemo(() => {
    return TaskStore.instance.subscribeTaskByTagName(tag);
  }, [tag])
}