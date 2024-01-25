import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
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
import { classNames } from "@espoojs/utils";

const ContentSlugs = [
  "content",
  "summary",
  "simplify",
  "words",
  "flashcards",
] as const;

const textSizes = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;
const layoutSizes = ["xs", "sm", "md", "lg", "xlg", "xxlg"] as const;

export const SidepanelApp = () => {
  const [taskId, setTaskId] = useState<
    { [key in StudyToolContentSlugs]?: string } | undefined
  >();
  const [taskStatus, setTaskStatus] = useState<TaskStatus>();
  const [textSize, setTextSize] = useState<number>(2);
  const [layoutSize, setLayoutSize] = useState<number>(2);

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
            return [(acc[0] || "") + (task.result || ""), task];
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
            if (task?.status === "completed")
              setTaskId((state) => ({
                ...state,
                [selectedContent]: undefined,
              }));
          },
        });

      return () => subscription.unsubscribe();
    }
  }, [selectedContent, taskId]);

  console.log(layoutSize, layoutSizes[layoutSize]);

  const { simplify, summarise } = useTranslateService();
  // const task = useTaskSubscribeById(taskId?.["Simplify"]);
  const isDisabled = taskStatus === "progress";
  const contentRef = useRef<HTMLDivElement | null>(null);
  const contentUrl = userContent?.selectedText?.siteName || "";
  const toolBarClickHandler = (link: StudyToolIconsSlugs) => {
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
    } else if (link === "text-decrease") {
      setTextSize((state) => (state > 0 ? state - 1 : state));
    } else if (link === "text-increase") {
      setTextSize((state) =>
        state < textSizes.length - 1 ? state + 1 : state,
      );
    } else if (link === "layout-decrease") {
      setLayoutSize((state) => (state > 0 ? state - 1 : state));
    } else if (link === "layout-increase") {
      setLayoutSize((state) =>
        state < layoutSizes.length - 1 ? state + 1 : state,
      );
    }

    setSelectedLink(link);
    if (ContentSlugs.includes(link as StudyToolContentSlugs))
      setSelectedContent(link as StudyToolContentSlugs);
  };

  return (
    <div className={styles.container}>
      <StudyToolbar
        selectedLink={selectedLink}
        disabled={isDisabled}
        onClick={toolBarClickHandler}
      />
      <main
        className={classNames(
          styles.content,
          styles[`layoutSize-${layoutSizes[layoutSize]}`],
        )}
      >
        <h1>
          {taskStatus === "progress" && <IconFidgetSpinner />}
          {userContent?.activeTabContent?.title || "No title"}
        </h1>
        <div
          ref={contentRef}
          className={classNames(
            styles.contentText,
            styles[`textSize-${textSizes[textSize]}`],
          )}
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
  );
};
