import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentReadActionsBar,
  ContentReadActionsSlugsType,
} from "./ContentReadActionsBar";
import styles from "./SidepanelApp.module.scss";
import { useTranslateService } from "../domain/translation/TranslationService";
import { SettingsAtom, SettingsStorage } from "../domain/user/SettingsModel";
import { UsersAtom, UserStorage } from "../domain/user/UserModel";
import { useCallback, useEffect, useRef, useState } from "react";
import { TaskNode, TaskStatus, TaskStore } from "@espoojs/task";
import {
  ContentContextAtom,
  ContentStorage,
  useStudyContentState,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { useTasksSyncByTagName } from "../api/task/useTasksSyncByTagName";
import { OperatorFunction, bufferTime, filter, map, scan } from "rxjs";
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
import { notifications } from "@mantine/notifications";
import { FlashCardsView } from "./flash-cards/FlashCardsView";
import { CrosswordsView } from "./crosswords/CrosswordsView";
import {
  WordsCollection,
} from "../domain/user/WordDescriptor";
import { useCurrentMywords } from "../domain/user/useCurrentMywords";

const textSizes = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;
const layoutSizes = ["xs", "sm", "md", "lg", "xlg", "xxlg"] as const;
let ID = 0;

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

  useLocalstorageSync({
    debugKey: "user-sidepanel",
    storageAtom: UsersAtom,
    contentStorage: UserStorage,
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
  const [CompID] = useState(() => ++ID);
  useEffect(() => {}, []);

  useEffect(() => {
    // if (!userContent.activeTabContent?.content)
    activeTabMessageDispatch({ type: "get-page-content" });
  }, []);

  useEffect(() => {
    const currentTaskId = studyTasks?.[selectedStudyAction];
    if (currentTaskId) {
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
              const newState = {
                [resultKey]: task.result,
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
          },
          complete() {
            setStudyTasks((state) => ({
              ...state,
              [selectedStudyAction]: undefined,
            }));
            setTaskStatus("completed");
          },
        });

      return () => {
        console.log("unsubscribeTaskById", CompID);
        subscription.unsubscribe();
      };
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
    } else {
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

  const getWords = useWordsStream();
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
        {selectedStudyAction !== "words" &&
        selectedStudyAction !== "corsswords" ? (
          <div
            className={classNames(styles[`textSize-${textSizes[textSize]}`])}
            dangerouslySetInnerHTML={{
              __html:
                selectedStudyAction === "content"
                  ? currentTabContent
                  : studyState[contentUrl]?.[selectedStudyAction] || "",
            }}
          />
        ) : null}
        {selectedStudyAction === "words" ? (
          <ExtractedWordsView words={getWords(studyState[contentUrl]?.[selectedStudyAction] || "")} loading={taskStatus === "progress"} />
        ) : null}
        {selectedStudyAction === "corsswords" ? <CrosswordsView /> : null}
        {selectedStudyAction === "flashcards" ? <FlashCardsView /> : null}
      </main>
    </div>
  );
};

const useWordsStream = () => {
  const {mywords} = useCurrentMywords();
  const parse = (content: string) => {
    const result: WordsCollection | undefined = content
      ?.split("\n")
      .reduce<WordsCollection>((acc, line) => {
        // |word|translation|kind|examples|
        const [word, translation, kind, ...examples] = line.trim().split("|");
        const getExamples = (example: string) => {
          const [lang, translation] = example.split("#");
          return { [lang]: translation };
        };

        const examplesCollection = examples.map(getExamples);
        acc = {
          ...acc,
          [word]: { translation, kind, examples: examplesCollection },
        };

        return acc;
      }, {});
    return result;
  };

  return useCallback((content: string) => {
    return content ? parse(content) : mywords;
  }, []);
};
