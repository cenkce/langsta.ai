import { TaskStatus, TaskStore, TaskNode } from "@espoojs/task";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { filter, OperatorFunction, bufferTime, map, scan } from "rxjs";
import { useStudyContentState } from "../domain/content/ContentContext.atom";
import { StudyActions } from "./ContentStudyActionsMenu";
import { StudyContentState } from "./StudyContentTasksAtom";

export const useStudyTaskHandler = (
  studyTasks?: StudyContentState,
  selectedStudyAction?: StudyActions,
  contentUrl?: string,
) => {
  const [taskStatus, setTaskStatus] = useState<TaskStatus>();
  const [studyState, setStudyState] = useStudyContentState();
  const currentTaskId = selectedStudyAction
    ? studyTasks?.[selectedStudyAction]
    : "";

  useEffect(() => {
    if (!selectedStudyAction || !currentTaskId) return;
    const currentTask = TaskStore.instance.getNode(currentTaskId);
    if (currentTask?.status === "completed") return;
    
    TaskStore.instance.name = "SidepanelApp";
    // stream task result
    const subscription = TaskStore.instance
      .subscribeTaskById(currentTaskId)
      .pipe(
        filter((task) => {
          return task !== undefined && task?.status !== "completed";
        }) as OperatorFunction<TaskNode | undefined, TaskNode>,
        bufferTime(500),
        filter((nodes) => {
          return nodes.length > 0;
        }),
        map((nodes) => {
          const task = nodes[nodes.length - 1];
          return {
            ...task,
            result: nodes
              .map((tsk) => tsk.result || "")
              .join("")
              .replace("\n\n", "\n"),
          };
        }),
        // merges buffered chunks and accumulates stream
        scan<TaskNode, TaskNode>(
          (acc, task) => {
            return task.result
              ? {
                  ...task,
                  result: acc.result + task.result,
                }
              : acc;
          },
          { result: "" } as TaskNode,
        ),
      )
      .subscribe({
        next: (task) => {
          if (task?.error) {
            notifications.show({
              color: "red",
              title: `Task Error: ${task.error.type.toUpperCase()}`,
              message: task.error.error.message,
              autoClose: 5000,
            });
            setTaskStatus(task?.status);
            return;
          }
          const url = contentUrl;

          const resultKey = task?.params?.tags
            .find((tag) => tag.includes("gpt/"))
            ?.replace("gpt/", "");
          if (resultKey === undefined) return;

          if (task.result && url) {
            setStudyState((state) => ({
              ...state,
              [url]: {
                ...state[url],
                [resultKey]: task.result,
              },
            }));
          }
          if (task?.status) setTaskStatus(task?.status);
        },
        complete() {
          setTaskStatus("completed");
        },
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [currentTaskId, studyTasks]);

  return {
    taskStatus,
    studyState,
    setStudyState,
    currentTaskId,
  };
};
