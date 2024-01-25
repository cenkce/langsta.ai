import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { ArtBoard } from "../ui/ArtBoard";
import {
  StudyToolContentSlugs,
  StudyToolIconsSlugs,
  StudyToolbar,
} from "./StudyToolBar";
import styles from "./SidepanelApp.module.scss";
import { useTranslateService } from "../domain/translation/TranslationService";
import { SettingsAtom, SettingsStorage } from "../domain/user/SettingsModel";
import { useEffect, useRef, useState } from "react";
import { IconFidgetSpinner } from "@tabler/icons-react";
import { TaskNode, TaskStatus, TaskStore } from "@espoojs/task";
import {
  ContentContextAtom,
  ContentStorage,
  useStudyContentState,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { useTasksSyncByTagName } from "../api/task/useTasksSyncByTagName";
import { OperatorFunction, filter, scan } from "rxjs";

export const SidepanelApp = () => {
  const [taskId, setTaskId] = useState<
    { [key in StudyToolContentSlugs]?: string } | undefined
  >();
  const [taskStatus, setTaskStatus] = useState<TaskStatus>();

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
  const [selectedLink, setSelectedLink] =
    useState<StudyToolIconsSlugs>("content");
  const [selectedContent, setSelectedContent] =
    useState<StudyToolContentSlugs>("content");
  const [studyState, setStudyState] = useStudyContentState();
  const userContent = useUserContentState();
  const userContentRef = useRef(userContent);
  userContentRef.current = userContent;

  useEffect(() => {
    const currentTaskId = taskId?.[selectedContent];
    if (currentTaskId) {
      const subscription = TaskStore.instance
        .subscribeTaskById(currentTaskId)
        .pipe(
          filter((task) => {
            return task !== undefined;
          }) as OperatorFunction<TaskNode | undefined, TaskNode>,
          scan<TaskNode, [string, TaskNode] | []>((acc, task) => {
            return [(acc[0] || "")  + (task.result || "" ), task];
          }, []),
        )
        .subscribe({
          next: ([result, task]) => {
            const siteName = userContentRef?.current?.selectedText?.siteName;
            const resultKey = task?.params?.tags.includes("gpt/simplify")
              ? "simplify"
              : "summary";
             console.log("result", result);
            result &&
              siteName &&
              setStudyState((state) => ({
                ...state,
                [siteName]: {
                  ...state[siteName],
                  [resultKey]: result,
                  updatedAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  level: "",
                  title: "",
                  url: siteName,
                },
              }));
            task?.status && setTaskStatus(task?.status);
            if(task?.status === "completed") 
              setTaskId((state) => ({ ...state, [selectedContent]: undefined }));
          },
        });

      return () => subscription.unsubscribe();
    }
  }, [selectedContent, taskId]);

  const { simplify, summarise } = useTranslateService();
  // const task = useTaskSubscribeById(taskId?.["Simplify"]);
  const isDisabled = taskStatus === "progress";
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentUrl = userContent?.selectedText?.siteName || "";
  return (
    <ArtBoard>
      <div className={styles.container}>
        <StudyToolbar
          selectedLink={selectedLink}
          disabled={isDisabled}
          onClick={(link) => {
            if (link === "summary") {
              !taskId?.[link] &&
                setTaskId((state = {}) => ({
                  ...state,
                  summary: summarise(
                    userContentRef.current?.activeTabContent?.textContent,
                  ),
                }));
            } else if (link === "simplify") {
              !taskId?.[link] &&
                setTaskId((state = {}) => ({
                  ...state,
                  simplify: simplify(
                    userContentRef.current?.activeTabContent?.textContent,
                  ),
                }));
            }
            setSelectedLink(link);
            if (
              link === "content" ||
              link === "summary" ||
              link === "simplify" ||
              link === "words" ||
              link === "flashcards"
            )
              setSelectedContent(link);
          }}
        />
        <main className={styles.content}>
          <h1>
            {taskStatus === "progress" && <IconFidgetSpinner />}
            {userContent?.activeTabContent?.title || "No title"}
          </h1>
          <div
            ref={contentRef}
            dangerouslySetInnerHTML={
              selectedContent !== "flashcards" && selectedContent !== "words"
                ? {
                    __html:
                      selectedContent === "content"
                        ? userContent?.activeTabContent?.content || ""
                        : studyState[contentUrl]?.[selectedContent] || "",
                  }
                : { __html: "" }
            }
          />
        </main>
      </div>
    </ArtBoard>
  );
};
