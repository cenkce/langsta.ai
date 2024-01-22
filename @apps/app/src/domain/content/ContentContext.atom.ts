import { LocalStorage } from "../../api/storage/LocalStorage";
import { TextSelector } from "../utils/getSelectedText";
import { useEffect, useState } from "react";
import { TranslationTextTask } from "../../api/task/TranslationTextTask";
import { Atom, StoreSubject, useAtom } from "@espoojs/atom";
import { ContentTask } from "../../api/task/ContentTask";
import shallowEqual from "../../api/utils/shallowEqual";

export const ContentStorage =
  LocalStorage.of<ContentContextState>("contentContextAtom");

export async function deleteTranslation(id: string) {
  const translations = await ContentStorage.read("translation");
  const newTranslations = { ...translations };
  if (id in newTranslations) delete newTranslations[id];
  ContentStorage.write("translation", newTranslations);
}

export type ContentContextState = {
  selectedText: {
    text: string;
    selectors?: [anchor: TextSelector, focus: TextSelector];
    siteName?: string;
  };
  activeTabContent: {
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
  translation: Record<string, TranslationTextTask>;
  contentTasks: Record<string, ContentTask>;
};

const contentStore = new StoreSubject({
  contentContextAtom: {
    selectedText: { text: "" },
    activeTabContent: {},
    translation: {}
  } as ContentContextState,
});

export const ContentContextAtom = Atom.of(
  { key: "contentContextAtom" },
  contentStore
);

export const useUserContentState = () => {
  return useAtom(ContentContextAtom, { ignoreUpdateKeys: ["contentTasks", "translation"], equalityCheck: shallowEqual })[0];
};

export const getSelectionByText = () => {
  return contentStore.getValue().contentContextAtom.selectedText?.selectors
}

export const useSubscribeTranslationTask = (id?: string) => {
  const [task, setTask] = useState<TranslationTextTask | undefined>();
  useEffect(() => {
    if (id) {
      const subs = ContentContextAtom.get$('translation').subscribe((translation) => {
        
        if (id && translation?.[id]) {
          setTask(translation[id]);
        }
      });

      return () => subs.unsubscribe();
    }
  }, [id]);
  return task;
};

export const useUserContentSetState = () => {
  return useAtom(ContentContextAtom, { noStateUpdate: true })[1];
};
