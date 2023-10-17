import { useAtom } from "../../api/core/useAtom";
import { Atom, StoreSubject } from "../../api/core/StoreSubject";
import { LocalStorage } from "../../api/storage/LocalStorage";
import { TaskStatus } from "../../api/task/TaskStore";

export const ContentStorage =
  LocalStorage.of<ContentContextState>("contentContextAtom");

export async function deleteTranslation(id: string) {
  const translations = await ContentStorage.read("translation");
  const newTranslations = { ...translations };
  if (id in newTranslations) delete newTranslations[id];
  ContentStorage.write("translation", newTranslations);
}

export type ContentContextState = {
  selectedText: string;
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

export type TranslationResponse = {
  translation: string;
  words: { [key: string]: { translation: string; kind: string }[] };
};

export type TranslationTextTask = {
  selectedText: string;
  taskId?: string;
  // result?: TranslationResponse;
  result?: string;
  error?: string;
  status: TaskStatus;
  createdAt: number;
};

export const ContentContextAtom = Atom.of(
  { key: "contentContextAtom" },
  new StoreSubject({
    contentContextAtom: {
      selectedText: "",
      activeTabContent: {},
      translation: {},
    } as Partial<ContentContextState>,
  })
);

export const useUserContentState = () => {
  return useAtom(ContentContextAtom);
};

export const useUserContentSetState = () => {
  return useAtom(ContentContextAtom, true);
};
