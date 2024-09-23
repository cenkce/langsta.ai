import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentReadActionsBar,
  ContentReadActionsSlugsType,
} from "./ContentReadActionsBar";
import styles from "./SidepanelApp.module.scss";
import { useTranslateService } from "../domain/translation/TranslationService";
import { SettingsAtom, SettingsStorage } from "../domain/user/SettingsModel";
import { useEffect, useRef, useState } from "react";
import { TaskNode, TaskStatus, TaskStore } from "@espoojs/task";
import {
  ContentContextAtom,
  ContentStorage,
  useStudyContentState,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { useTasksSyncByTagName } from "../api/task/useTasksSyncByTagName";
import { OperatorFunction, bufferTime, filter, scan } from "rxjs";
import { classNames } from "@espoojs/utils";
import { useEventListener } from "@mantine/hooks";
import {
  ContentStudyActionsBar,
  ContentStudyActionsIconsSlugsType,
} from "./ContentStudyActionsBar";
import { activeTabMessageDispatch } from "../domain/content/activeTabMessageDispatch";
import { Divider, Title } from "@mantine/core";
import { ExtractedWordsView } from "./extract-words/ExtractedWordsView";
import { useAtom } from "@espoojs/atom";
import { studyContentTasksAtom } from "./StudyContentTasksAtom";

const textSizes = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;
const layoutSizes = ["xs", "sm", "md", "lg", "xlg", "xxlg"] as const;

export const SidepanelApp = () => {
  const [taskStatus, setTaskStatus] = useState<TaskStatus>();
  const [textSize, setTextSize] = useState<number>(2);
  const [layoutSize, setLayoutSize] = useState<number>(2);
  const [studyTasks, setStudyTasks] = useAtom(studyContentTasksAtom);

  useLocalstorageSync({
    debugKey: "content-sidepanel-study-mode",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
    verbose: true,
  });

  useLocalstorageSync({
    debugKey: "settings-sidepanel",
    storageAtom: SettingsAtom,
    contentStorage: SettingsStorage,
  });

  useTasksSyncByTagName("background-task");
  const [selectedReadActions, setSelectedReadActions] = useState<
    ContentReadActionsSlugsType | undefined
  >();
  const [selectedStudyAction, setSelectedStudyAction] =
    useState<ContentStudyActionsIconsSlugsType>("content");
  const [studyState, setStudyState] = useStudyContentState();
  const userContent = useUserContentState();
  const userContentRef = useRef(userContent);
  userContentRef.current = userContent;

  useEffect(() => {
    // if (!userContent.activeTabContent?.content)
    activeTabMessageDispatch({ type: "get-page-content" });
  }, []);

  useEffect(() => {
    const currentTaskId = studyTasks?.[selectedStudyAction];
    if (currentTaskId) {
      // stream task result
      const subscription = TaskStore.instance
        .subscribeTaskById(currentTaskId)
        .pipe(
          filter((task) => {
            return task !== undefined;
          }) as OperatorFunction<TaskNode | undefined, TaskNode>,
          bufferTime(500),
          // merges buffered chunks and accumulates stream
          scan<TaskNode[], [string, TaskNode | undefined] | []>(
            (acc, nodes) => {
              let result = "";
              let task: TaskNode | undefined;
              nodes?.forEach((tsk) => {
                result += tsk.result || "";
                task = tsk;
              });

              return [(acc[0] || "") + (result || ""), task];
            },
            [],
          ),
        )
        .subscribe({
          next: ([result = "", task]) => {
            const url = contentUrl;

            const resultKey = task?.params?.tags
              .find((tag) => tag.includes("gpt/"))
              ?.replace("gpt/", "");
            if (resultKey === undefined) return;

            if (result && url) {
              const newState = {
                [resultKey]: result,
                updatedAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                level: "",
                title: "",
                url: url,
              };

              setStudyState((state) => ({
                ...state,
                [url]: newState,
              }));
            }
            if (task?.status) setTaskStatus(task?.status);
            if (task?.status === "completed") {
              setStudyTasks((state) => ({
                ...state,
                [selectedStudyAction]: undefined,
              }));
              subscription.unsubscribe();
            }
          },
        });

      return () => subscription.unsubscribe();
    }
  }, [selectedStudyAction, studyTasks]);

  const { simplify, summarise, extractWords } = useTranslateService();
  const isDisabled = taskStatus === "progress";
  const contentUrl = userContent?.activeTabUrl || "";
  const contentFromCache = studyState[contentUrl];
  const hasSummary = !!contentFromCache?.summary;
  // const hasWords = !!contentFromCache?.words;
  const hasSimplifed = !!contentFromCache?.simplify;

  const readActionsClickHandler = (link: ContentReadActionsSlugsType) => {
    if (link === "text-decrease") {
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

    setSelectedReadActions(link);
  };

  const studyActionsClickHandler = (
    link: ContentStudyActionsIconsSlugsType,
  ) => {
    if (link === "content") {
      setSelectedStudyAction(link);
    } else if (link === "words") {
      if (!studyTasks?.[link])
        setStudyTasks((state = {}) => ({
          ...state,
          words: extractWords(
            userContentRef.current?.activeTabContent?.[contentUrl]?.textContent,
          ),
        }));
      setSelectedStudyAction(link);
    } else if (link === "summary") {
      if (!studyTasks?.[link] && !hasSummary)
        setStudyTasks((state = {}) => ({
          ...state,
          summary: summarise(
            userContentRef.current?.activeTabContent?.[contentUrl]?.textContent,
          ),
        }));
      setSelectedStudyAction(link);
    } else if (link === "simplify") {
      if (!studyTasks?.[link] && !hasSimplifed)
        setStudyTasks((state = {}) => ({
          ...state,
          simplify: simplify(
            userContentRef.current?.activeTabContent?.[contentUrl]?.textContent,
          ),
        }));
      setSelectedStudyAction(link);
    } else if (link === "flashcards") {
      setSelectedStudyAction(link);
    }
  };

  const [isPinned, setIsPinned] = useState<boolean>(false);

  const scrollContainerRef = useEventListener("scroll", () => {
    setIsPinned(scrollContainerRef.current?.scrollTop > 200);
  });

  const currentTabContent = userContent?.activeTabUrl
    ? userContent?.activeTabContent?.[userContent?.activeTabUrl]?.content || ""
    : "";
  const currentTabTitle = userContent?.activeTabUrl
    ? userContent?.activeTabContent?.[userContent?.activeTabUrl]?.title || ""
    : "";
  // taskStatus === "progress"
  return (
    <div ref={scrollContainerRef} className={styles.container}>
      <section className={styles.studyActionsContainer}>
        <ContentStudyActionsBar
          selectedLink={selectedStudyAction}
          disabled={isDisabled}
          onClick={studyActionsClickHandler}
        />
      </section>
      <main
        className={classNames(
          styles.content,
          styles[`layoutSize-${layoutSizes[layoutSize]}`],
        )}
      >
        <section className={classNames(styles.readActionsContainer, isPinned)}>
          <ContentReadActionsBar
            className={styles.horizontal}
            selectedLink={selectedReadActions}
            disabled={isDisabled}
            onClick={readActionsClickHandler}
          />
        </section>
        <Title my={"1rem"} size={"h3"}>
          {currentTabTitle || "No title"}
        </Title>
        <Divider my={"1rem 1rem"}></Divider>
        <div
          className={classNames(styles[`textSize-${textSizes[textSize]}`])}
          dangerouslySetInnerHTML={
            selectedStudyAction !== "flashcards" &&
            selectedStudyAction !== "words"
              ? {
                  __html:
                    selectedStudyAction === "content"
                      ? currentTabContent
                      : studyState[contentUrl]?.[selectedStudyAction] || "",
                }
              : { __html: "" }
          }
        />
        {selectedStudyAction === "words" ? (
          <ExtractedWordsView
            loading={taskStatus === "progress"}
            words={studyState[contentUrl]?.[selectedStudyAction] as any}
          />
        ) : null}
      </main>
    </div>
  );
};
