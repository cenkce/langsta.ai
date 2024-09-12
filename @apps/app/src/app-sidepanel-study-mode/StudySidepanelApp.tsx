import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentReadActionsBar,
  ContentReadActionsSlugsType,
} from "./ContentReadActionsBar";
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
import { useEventListener } from "@mantine/hooks";
import {
  ContentStudyActionsBar,
  ContentStudyActionsIconsSlugsType,
} from "./ContentStudyActionsBar";
import { activeTabMessageDispatch } from "../domain/content/activeTabMessageDispatch";

const textSizes = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;
const layoutSizes = ["xs", "sm", "md", "lg", "xlg", "xxlg"] as const;

export const SidepanelApp = () => {
  const [taskId, setTaskId] = useState<
    { [key in ContentStudyActionsIconsSlugsType]?: string } | undefined
  >();
  const [taskStatus, setTaskStatus] = useState<TaskStatus>();
  const [textSize, setTextSize] = useState<number>(2);
  const [layoutSize, setLayoutSize] = useState<number>(2);

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
    if (!userContent.activeTabContent?.content)
      activeTabMessageDispatch({ type: "get-page-content" });
  }, []);

  useEffect(() => {
    const currentTaskId = taskId?.[selectedStudyAction];
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
            const url = userContentRef?.current?.selectedText?.url;
            const resultKey = task?.params?.tags
              .find((tag) => tag.includes("gpt/"))
              ?.replace("gpt/", "");
            if (resultKey === undefined) return;

            if (result && url)
              setStudyState((state) => ({
                ...state,
                [url]: {
                  ...state[url],
                  [resultKey]: result,
                  updatedAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  level: "",
                  title: "",
                  url: url,
                },
              }));
            if (task?.status) setTaskStatus(task?.status);
            if (task?.status === "completed")
              setTaskId((state) => ({
                ...state,
                [selectedStudyAction]: undefined,
              }));
          },
        });

      return () => subscription.unsubscribe();
    }
  }, [selectedStudyAction, taskId]);

  const { simplify, summarise, extractWords } = useTranslateService();
  const isDisabled = taskStatus === "progress";
  const contentUrl = userContent?.selectedText?.url || "";
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
      if (!taskId?.[link])
        setTaskId((state = {}) => ({
          ...state,
          summary: extractWords(
            userContentRef.current?.activeTabContent?.[contentUrl]?.textContent,
          ),
        }));
      setSelectedStudyAction(link);
    } else if (link === "summary") {
      if (!taskId?.[link] && !hasSummary)
        setTaskId((state = {}) => ({
          ...state,
          summary: summarise(
            userContentRef.current?.activeTabContent?.[contentUrl]?.textContent,
          ),
        }));
      setSelectedStudyAction(link);
    } else if (link === "simplify") {
      if (!taskId?.[link] && !hasSimplifed)
        setTaskId((state = {}) => ({
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
    ? userContent?.activeTabContent?.[userContent?.activeTabUrl]?.content ||
      ""
    : "";
  const currentTabTitle = userContent?.activeTabUrl
    ? userContent?.activeTabContent?.[userContent?.activeTabUrl]?.title ||
      ""
    : "";

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
        <header
          onClick={() => {
            activeTabMessageDispatch({ type: "get-page-content" });
          }}
        >
          <h1>
            {taskStatus === "progress" && <IconFidgetSpinner />}
            {currentTabTitle || "No title"}
          </h1>
        </header>
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
      </main>
    </div>
  );
};
