import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentReadActionsBar,
  ContentReadActionsSlugsType,
} from "./ContentReadActionsBar";
import styles from "./SidepanelApp.module.css";
import { useTranslateService } from "../domain/translation/TranslationService";
import { SettingsAtom, SettingsStorage } from "../domain/user/SettingsModel";
import { UsersAtom, UserStorage } from "../domain/user/UserModel";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ContentContextAtom,
  ContentStorage,
  PageContent,
  StudyContentAtom,
  StudyContentStorage,
  useUserContentSetState,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { useTasksSyncByTagName } from "../api/task/useTasksSyncByTagName";
import { classNames } from "@espoojs/utils";
import { useEventListener } from "@mantine/hooks";
import {
  ContentStudyActionsMenu,
  ContentStudyActionsIconsSlugsType,
  StudyActions,
} from "./ContentStudyActionsMenu";
import { activeTabMessageDispatch } from "../domain/content/activeTabMessageDispatch";
import {
  ActionIcon,
  Card,
  Divider,
  Flex,
  Menu,
  rem,
  Text,
  Title,
} from "@mantine/core";
import { ExtractedWordsView } from "./extract-words/ExtractedWordsView";
import { useAtom } from "@espoojs/atom";
import { studyContentTasksAtom } from "./StudyContentTasksAtom";
import { FlashCardsView } from "./flash-cards/FlashCardsView";
import { CrosswordsView } from "./crosswords/CrosswordsView";
import { WordsCollection } from "../domain/user/WordDescriptor";
import { useCurrentMywords } from "../domain/user/useCurrentMywords";
import { useStudyTaskHandler } from "./useStudyTaskHandler";
import {
  IconDots,
  IconPlus,
  IconDeviceFloppy,
  IconTrash,
} from "@tabler/icons-react";

const textSizes = ["xs", "sm", "md", "lg", "xl", "xxl"] as const;
const layoutSizes = ["xs", "sm", "md", "lg", "xlg", "xxlg"] as const;

export const SidepanelApp = () => {
  useLocalstorageSync({
    debugKey: "content-sidepanel-study-mode",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });

  useLocalstorageSync({
    debugKey: "content-sidepanel-study-mode",
    storageAtom: SettingsAtom,
    contentStorage: SettingsStorage,
  });
  useLocalstorageSync({
    debugKey: "content-sidepanel-study-mode",
    storageAtom: StudyContentAtom,
    contentStorage: StudyContentStorage,
  });

  useLocalstorageSync({
    debugKey: "content-sidepanel-study-mode",
    storageAtom: UsersAtom,
    contentStorage: UserStorage,
  });

  useTasksSyncByTagName("background-task");

  const userContent = useUserContentState();
  const setUserContents = useUserContentSetState();
  const [selectedNote, setSelectedNote] = useState<string | undefined>();
  const [activeTabContent, setActiveTabContent] = useState<
    PageContent | undefined
  >();

  useEffect(() => {
    // if (userContent.activeTabUrl && !userContent.activeTabContent?.[userContent.activeTabUrl])
    activeTabMessageDispatch({ type: "get-page-content" }).then((props) => {
      if (props?.content) setActiveTabContent(props.content as PageContent);
    });
  }, []);

  const notes = useMemo(() => {
    const userContents = { ...userContent?.activeTabContent };
    if (activeTabContent && userContent.activeTabUrl)
      userContents[userContent.activeTabUrl] = activeTabContent;

    return userContents;
  }, [
    userContent.activeTabContent,
    userContent.activeTabUrl,
    activeTabContent,
  ]);

  const doSaveContent = (url: string, content: PageContent | undefined) => {
    setUserContents((state) => {
      const activeTabContent = state.activeTabContent || {};
      return {
        ...state,
        activeTabContent: {
          ...activeTabContent,
          [url]: content,
        },
      };
    });
  };

  return !selectedNote ? (
    <Flex gap={"md"} p={"md"} wrap={"wrap"}>
      {" "}
      {Object.entries(notes).map(([url, content]) => {
        return (
          <NoteCard
            key={url}
            title={content?.title}
            content={content}
            url={url}
            active={url === userContent.activeTabUrl}
            isSaved={!!userContent.activeTabContent?.[url]}
            onMenuClick={(action, url) => {
              if (action === "open") setSelectedNote(url);
              if (action === "save" && url) {
                doSaveContent(url, content);
              } else if (action === "remove" && url) {
                setUserContents((state) => {
                  const activeTabContent = { ...state.activeTabContent };
                  delete activeTabContent[url];
                  return {
                    ...state,
                    activeTabContent,
                  };
                });
              }
            }}
          />
        );
      })}
    </Flex>
  ) : (
    <NotebookReader
      onClose={() => {
        setSelectedNote(undefined);
      }}
      onSave={(url) => {
        if (url) doSaveContent(url, activeTabContent);
      }}
      isSaved={!!userContent.activeTabContent?.[selectedNote]}
      url={selectedNote}
      notes={notes}
    />
  );
};

export const NoteCard = (props: {
  active?: boolean;
  title?: string;
  url?: string;
  isSaved?: boolean;
  content?: PageContent;
  onMenuClick: (action: "save" | "open" | "remove", url?: string) => void;
}) => {
  return (
    <Card
      style={{
        gap: "1rem",
        flexGrow: 1,
        flexBasis: rem(250),
        borderColor: props.active ? "var(--mantine-color-red-6)" : "default",
      }}
      maw={rem(380)}
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Flex justify="space-between" direction={"row"}>
          <Title
            size={"12px"}
            style={{
              textOverflow: "ellipsis",
              overflow: "hidden",
              height: "2rem",
            }}
          >
            {props.title}
          </Title>
          {/* <Text size="xs">{upperFirst(descriptor.translation)}</Text> */}

          <Menu
            withinPortal
            position="bottom-end"
            portalProps={{ style: { position: "absolute" } }}
            shadow="sm"
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                onClick={() => props.onMenuClick?.("open", props.url)}
                leftSection={
                  <IconPlus style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Open
              </Menu.Item>
              <Menu.Item
                disabled={props.isSaved}
                leftSection={
                  <IconDeviceFloppy
                    style={{ width: rem(14), height: rem(14) }}
                  />
                }
                onClick={() => props.onMenuClick?.("save", props.url)}
              >
                Save
              </Menu.Item>
              <Menu.Item
                // onClick={() => onMenuClick?.("remove", descriptor)}
                leftSection={
                  <IconTrash style={{ width: rem(14), height: rem(14) }} />
                }
                color="red"
                onClick={() => props.onMenuClick?.("remove", props.url)}
              >
                Remove
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </Card.Section>
      <Flex bottom={0} pos={"sticky"} gap={"md"} justify={"space-between"}>
        <Text size="xs">
          Published Date:{" "}
          {new Date(props.content?.publishedTime || "").toLocaleDateString()}
        </Text>
        <Text size="xs">
          Saved Date:{" "}
          {new Date(props.content?.publishedTime || "").toLocaleDateString()}
        </Text>
      </Flex>
    </Card>
  );
};

const NotebookReader = (props: {
  url: string;
  notes: Record<string, PageContent | undefined>;
  onClose: () => void;
  isSaved?: boolean;
  onSave: (url?: string) => void;
}) => {
  const [textSize, setTextSize] = useState<number>(2);
  const [layoutSize, setLayoutSize] = useState<number>(2);
  const [studyTasks, setStudyTasks] = useAtom(studyContentTasksAtom);

  const [selectedReadActions, setSelectedReadActions] = useState<
    ContentReadActionsSlugsType | undefined
  >();
  const [selectedStudyAction, setSelectedStudyAction] =
    useState<StudyActions>("content");
  // const userContent = useUserContentState();
  const userContentRef = useRef(props.notes);
  userContentRef.current = props.notes;
  const contentUrl = props.url;
  const { taskStatus, studyState, setStudyState } = useStudyTaskHandler(
    studyTasks,
    selectedStudyAction,
    contentUrl,
  );

  const isDisabled = taskStatus === "progress";
  // const [CompID] = useState(() => ++ID);

  const { simplify, summarise, extractWords } = useTranslateService();

  const contentFromCache = studyState[contentUrl];
  const hasSummary = !!contentFromCache?.summary;
  const hasWords = !!contentFromCache?.words;
  const hasSimplifed = !!contentFromCache?.simplify;

  const readActionsClickHandler = (link: ContentReadActionsSlugsType) => {
    if (link === "text-decrease") {
      setTextSize((state) => (state > 0 ? state - 1 : state));
    } else if (link === "text-increase") {
      setTextSize((state) =>
        state < textSizes.length - 1 ? state + 1 : state,
      );
    } else if (link === "close") {
      props.onClose();
    } else if (link === "favorite") {
      props.onSave(props.url);
    } else if (link === "layout-decrease") {
      setLayoutSize((state) => (state > 0 ? state - 1 : state));
    } else if (link === "layout-increase") {
      setLayoutSize((state) =>
        state < layoutSizes.length - 1 ? state + 1 : state,
      );
    } else if (link === "reset") {
      const task = studyTaskFactory(selectedStudyAction);
      if (task) {
        resetContentHandler(selectedStudyAction);
        setStudyTasks((state = {}) => ({
          ...state,
          [selectedStudyAction]: task,
        }));
      }
    }

    setSelectedReadActions(link);
  };

  const studyTaskFactory = (link: ContentStudyActionsIconsSlugsType) => {
    const textContent = props.notes?.[contentUrl]?.textContent;
    if (!textContent) return null;

    switch (link) {
      case "words":
        return extractWords(textContent);
      case "summary":
        return summarise(textContent);
      case "simplify":
        return simplify(textContent);
      default:
        return null;
    }
  };

  const studyActionsClickHandler = (
    link: ContentStudyActionsIconsSlugsType,
  ) => {
    const task = studyTaskFactory(link);
    switch (link) {
      case "words":
        if (!studyTasks?.[link] && !hasWords && task)
          setStudyTasks((state = {}) => ({
            ...state,
            words: task,
          }));
        setSelectedStudyAction(link);
        break;
      case "summary":
        if (!studyTasks?.[link] && !hasSummary && task)
          setStudyTasks((state = {}) => ({
            ...state,
            summary: task,
          }));
        setSelectedStudyAction(link);
        break;
      case "simplify":
        if (!studyTasks?.[link] && !hasSimplifed && task)
          setStudyTasks((state = {}) => ({
            ...state,
            simplify: task,
          }));
        setSelectedStudyAction(link);
        break;

      default:
        setSelectedStudyAction(link);
        break;
    }
  };

  const [isPinned, setIsPinned] = useState<boolean>(false);

  const scrollContainerRef = useEventListener("scroll", () => {
    setIsPinned(scrollContainerRef.current?.scrollTop > 200);
  });

  const currentTabContent = props.notes?.[contentUrl]?.content || "";
  const currentTabTitle = props.notes?.[contentUrl]?.title || "";

  const resetContentHandler = (section: ContentStudyActionsIconsSlugsType) => {
    setStudyState((state) => {
      if (!state?.[contentUrl]) return state;
      const newState = { ...state[contentUrl] };
      switch (section) {
        case "crosswords":
        case "words":
          newState.words = undefined;
          break;
        case "summary":
          newState.summary = undefined;
          break;
        case "simplify":
          newState.simplify = undefined;
          break;
      }

      return { ...state, [contentUrl]: newState };
    });
  };

  const getWords = useWordsStream();
  return (
    <div ref={scrollContainerRef} className={styles.container}>
      <section className={styles.studyActionsContainer}>
        <ContentStudyActionsMenu
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
            isSaved={props.isSaved}
          />
        </section>
        <Title my={"1rem"} size={"h3"}>
          {currentTabTitle || "No title"}
        </Title>
        <Divider my={"1rem 1rem"}></Divider>
        {selectedStudyAction !== "words" &&
        selectedStudyAction !== "crosswords" ? (
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
          <ExtractedWordsView
            words={getWords(
              studyState[contentUrl]?.[selectedStudyAction] || "",
            )}
            loading={taskStatus === "progress"}
          />
        ) : null}
        {selectedStudyAction === "crosswords" ? <CrosswordsView /> : null}
        {selectedStudyAction === "flashcards" ? <FlashCardsView /> : null}
      </main>
    </div>
  );
};

const useWordsStream = () => {
  const { mywords } = useCurrentMywords();
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
