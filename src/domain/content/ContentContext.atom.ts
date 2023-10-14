import { useAtom } from "../../api/core/useAtom";
import { Atom, StoreSubject } from "../../api/core/StoreSubject";
import { LocalStorage } from "../../api/storage/LocalStorage";


export const ContentStorage = LocalStorage.of<ContentContextState>("contentContextAtom");

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
  translation: {
    translation: string;
    words: { [key: string]: { translation: string; kind: string }[] };
  };
};
export const ContentContextAtom = Atom.of({key: 'contentContextAtom'}, new StoreSubject({'contentContextAtom': {} as Partial<ContentContextState>}))

export const useUserContentState = () => {
  return useAtom(ContentContextAtom);
};

export const useUserContentSetState = () => {
  return useAtom(ContentContextAtom, true);
};
