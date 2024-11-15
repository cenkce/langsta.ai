import { LocalStorage } from "../../api/storage/LocalStorage";
import { TextSelector } from "../utils/getSelectedText";
import { useEffect, useState } from "react";
import { TranslationTextTask } from "../../api/task/TranslationTextTask";
import { Atom, StoreSubject, useAtom } from "@espoojs/atom";
import { ContentTask } from "../../api/task/ContentTask";
import shallowEqual from "../../api/utils/shallowEqual";

export const ContentStorage =
  LocalStorage.of<UserContentState>("contentContextAtom");

export async function deleteTranslation(id: string) {
  const translations = await ContentStorage.read("translation");
  const newTranslations = { ...translations };
  if (id in newTranslations) delete newTranslations[id];
  ContentStorage.write("translation", newTranslations);
}

export type StudyContentType = {
  url: string;
  title: string;
  summary?: string;
  simplify?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  words?: string;
  level: string;
  flashcards?: { word: string; translation: string }[];
};

export type PageContent = {
  title: string;
  content: string;
  textContent: string;
  length: number;
  excerpt: string;
  byline: string;
  dir: string;
  siteName: string;
  lang: string;
  publishedTime: string;
};

export type UserContentState = {
  selectedText: {
    text: string;
    selectors?: [anchor: TextSelector, focus: TextSelector];
    url?: string;
  } | undefined;
  activeTabContent: {[url: string]: PageContent | undefined} | undefined;
  /**
   * @TODO this should be under a url
   */
  translation: Record<string, TranslationTextTask> | undefined;
  contentTasks: Record<string, ContentTask> | undefined;
  activeTabUrl: string | undefined;
};

const contentStore = new StoreSubject<{
  contentContextAtom: UserContentState;
  studyContent: {
    [url: string]: StudyContentType;
  };
}>({
  contentContextAtom: {
    selectedText: undefined,
    activeTabContent: {},
    translation: undefined,
    contentTasks: undefined,
    activeTabUrl: undefined
  },
  studyContent: {} as {
    [url: string]: StudyContentType;
  },
});

export const ContentContextAtom = Atom.of(
  { key: "contentContextAtom" },
  contentStore,
);

export const StudyContentAtom = Atom.of({ key: "studyContent" }, contentStore);
export const StudyContentStorage = LocalStorage.of<StudyContentType>("studyContent");

export const useUserContentState = () => {
  return useAtom(ContentContextAtom, {
    ignoreUpdateKeys: ["contentTasks", "translation"],
    equalityCheck: shallowEqual,
  })[0];
};

export const useStudyContentState = () => {
  return useAtom(StudyContentAtom, {
    equalityCheck: shallowEqual,
  });
};

export const getSelectionByText = () => {
  return contentStore.getValue().contentContextAtom.selectedText?.selectors;
};

export const useSubscribeTranslationTask = (id?: string) => {
  const [task, setTask] = useState<TranslationTextTask | undefined>();
  useEffect(() => {
    if (id) {
      const subs = ContentContextAtom.get$("translation").subscribe(
        (translation) => {
          if (id && translation?.[id]) {
            setTask(translation[id]);
          }
        },
      );

      return () => subs.unsubscribe();
    }
  }, [id]);
  return task;
};

export const useUserContentSetState = () => {
  return useAtom(ContentContextAtom, { noStateUpdate: true })[1];
};
