import { useAtom } from "../../api/core/useAtom";
import { Atom, StoreSubject } from "../../api/core/StoreSubject";
import { LocalStorage } from "../../api/storage/LocalStorage";
import { TextSelector } from "../utils/getSelectedText";
import { useEffect, useState } from "react";
import { TranslationTextTask } from "../../api/task/TranslationTextTask";

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
  };
  translation: Record<string, TranslationTextTask>;
};

const contentStore = new StoreSubject({
  contentContextAtom: {
    selectedText: { text: "" },
    activeTabContent: {},
    translation: {},
  } as Partial<ContentContextState>,
});

export const ContentContextAtom = Atom.of(
  { key: "contentContextAtom" },
  contentStore
);

export const useUserContentState = () => {
  return useAtom(ContentContextAtom);
};

export const getSelectionByText = () => {
  contentStore.getValue().contentContextAtom.selectedText?.selectors
}

export const useSubscribeTranslationTask = (id?: string) => {
  const [task, setTask] = useState<TranslationTextTask | undefined>();
  useEffect(() => {
    if (id) {
      const subs = contentStore.subscribe(({ contentContextAtom: { translation } }) => {
        
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
  return useAtom(ContentContextAtom, true);
};
