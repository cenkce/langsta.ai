import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { ArtBoard } from "../ui/ArtBoard";
import { StudyToolbar } from "./StudyToolBar";
import styles from "./SidepanelApp.module.scss";
import { useTranslateService } from "../domain/translation/TranslationService";
import { SettingsAtom, SettingsStorage } from "../domain/user/SettingsModel";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { TaskNode, TaskStore } from "@espoojs/task";
import {
  ContentContextAtom,
  ContentStorage,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { useTasksSyncByTagName } from "../api/task/useTasksSyncByTagName";
import { OperatorFunction, filter, map } from "rxjs";

type studyToolNames = ComponentProps<typeof StudyToolbar>["selectedLink"];

export const SidepanelApp = () => {
  const [taskId, setTaskId] = useState<
    { [key in studyToolNames]?: string } | undefined
  >();
  const [[taskResult, taskStatus] = [], setTask] =
    useState<[result: string, status: string]>();

  useLocalstorageSync({
    debugKey: "content-sidepanel-study-mode",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });

  useLocalstorageSync({
    debugKey: "settings-sidepanel",
    storageAtom: SettingsAtom,
    contentStorage: SettingsStorage,
  });

  useTasksSyncByTagName("background-task");
  const [selectedLink, setSelectedLink] = useState<studyToolNames>("Content");

  useEffect(() => {
    const currentTaskId = taskId?.[selectedLink];
    if (currentTaskId) {
      const subscription = TaskStore.instance
        .subscribeTaskById(currentTaskId)
        .pipe(
          filter((task) => {
            return task !== undefined;
          }) as OperatorFunction<TaskNode | undefined, TaskNode>,
          map((task) => {
            return [task.result, task.status] as const;
          }),
          // bufferTime(1000),
        )
        .subscribe({
          next: ([result, status]) => {
            console.log("status : ", status);
            if(status === "completed") {
              subscription.unsubscribe();
            }
            if (!result) {
              return;
            }
            setTask(([existingRes] = ["", ""]) => {
              // const mergedResult = result.reduce((acc, [res]) => {
              //   return acc + res;
              // }, existingRes);
              // const recentStatus = result[result.length - 1][1];
              return [existingRes + result, status] as [string, string];
            });
          },
        });

      return () => subscription.unsubscribe();
    }
  }, [selectedLink, taskId]);

  const { simplify, summarise } = useTranslateService();
  const userContent = useUserContentState();
  // const task = useTaskSubscribeById(taskId?.["Simplify"]);
  const isDisabled = taskStatus === "progress";

  const contentRef = useRef<HTMLDivElement | null>(null);

  return (
    <ArtBoard>
      <div className={styles.container}>
        <StudyToolbar
          selectedLink={selectedLink}
          disabled={isDisabled}
          onClick={(link) => {
            if (link === "Summarise") {
              !taskId?.["Summarise"] &&
                setTaskId((state = {}) => ({
                  ...state,
                  Summarise: summarise(
                    userContent.activeTabContent.textContent,
                  ),
                }));
            } else if (link === "Simplify") {
              !taskId?.["Simplify"] &&
                setTaskId((state = {}) => ({
                  ...state,
                  Simplify: simplify(userContent.activeTabContent.textContent),
                }));
            }
            setSelectedLink(link);
          }}
        />
        <main className={styles.content}>
          <h1>
            {taskStatus === "progress" && <IconFidgetSpinner />}
            {/* {userContent.activeTabContent.title} */}
          </h1>
          <div
            ref={contentRef}
            dangerouslySetInnerHTML={{
              __html: taskResult
                ? taskResult || ""
                : userContent.activeTabContent.content,
            }}
          />
        </main>
      </div>
    </ArtBoard>
  );
};
