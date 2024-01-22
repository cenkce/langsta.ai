import { useCallback, useEffect, useMemo, useState } from "react";
import { Task, TaskNode, TaskParams, TaskStore } from "./TaskStore";

export const useTask = () => {
  return useCallback((task: Task, params?: TaskParams) => {
      return TaskStore.createTaskAtom(task, params);
  }, []);
}

export const useTaskSubscribeById = (id?: string) => {
  const [task , setSetTask] = useState<TaskNode>();

  useEffect(() => {
    if(id) {
      const task$ = TaskStore.instance.subscribeTaskById(id);
      const subs = task$.subscribe((node) => {
        if(node) {
          setSetTask(node);
        }
      });

      return () => subs.unsubscribe();
    }
  }, [id]);

  return task;
}

export const useTaskSubscribeByTag = (tag: string) => {
  return useMemo(() => {
    return TaskStore.instance.subscribeTaskByTagName(tag);
  }, [tag])
}