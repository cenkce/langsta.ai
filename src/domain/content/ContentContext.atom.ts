import { BehaviorSubject } from "rxjs";
import { useAtom } from "../../core/useAtom";

export enum ContentStorageList {
  contentContextAtom = "contentContextAtom",
}

// const ContentContextAtomChecker = voidable(
//   object({
//     selectedText: voidable(string()),
//     activeTabContent: voidable(
//       nullable(
//         object({
//           title: string(),
//           content: string(),
//           textContent: string(),
//           length: number(),
//           excerpt: string(),
//           byline: string(),
//           dir: string(),
//           siteName: string(),
//           lang: string(),
//         })
//       )
//     ),
//     translation: optional(
//       object({
//         translation: string(),
//         words: array(dict(object({ translation: string(), kind: string() }))),
//       })
//     ),
//   })
// ) as Partial<ContentContextState>;

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

export const ContentContextAtom = new BehaviorSubject<
  Partial<ContentContextState>
>({});

export const useUserContentState = () => {
  return useAtom(ContentContextAtom);
};

export const useUserContentSetState = () => {
  return useAtom(ContentContextAtom, true);
};
