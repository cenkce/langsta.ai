import { useAtom } from "../../core/useAtom";
import { Atom, StoreSubject } from "../../core/StoreSubject";

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
// <Record<'contentContextAtom', Partial<ContentContextState>>>
export const ContentContextAtom = Atom.of({key: 'contentContextAtom'}, new StoreSubject({'contentContextAtom': {} as Partial<ContentContextState>}))
export const TranslateionContextAtom = Atom.of({key: 'translation'}, new StoreSubject({'translation': 0}))
TranslateionContextAtom.get$().subscribe((value) => value)
ContentContextAtom.get$('activeTabContent').subscribe((value) => value);

export const useUserContentState = () => {
  return useAtom(ContentContextAtom);
};

export const useUserContentSetState = () => {
  return useAtom(ContentContextAtom, true);
};
