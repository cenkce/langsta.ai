import { atom, useRecoilState, useRecoilValue } from "recoil";
import { syncEffect } from "recoil-sync";
import { nullable, number, object, string, voidable } from "@recoiljs/refine";

const ContentContextAtomChecker = voidable(object({
  selectedText: voidable(string()),
  activeTabContent: voidable(nullable(object({
    title: string(),
    content: string(),
    textContent: string(),
    length: number(),
    excerpt: string(),
    byline: string(),
    dir: string(),
    siteName: string(),
    lang: string(),
  })))
}));

export type ContentContextState = {
  selectedText: string,
  activeTabContent: {
    title: string,
    content: string,
    textContent: string,
    length: number,
    excerpt: string,
    byline: string,
    dir: string,
    siteName: string,
    lang: string,
  }
};

const ContentContextAtom = atom({
  key: "contentContextAtom",
  default: {
    activeTabContent: undefined,
    selectedText: undefined
  },
  effects: [
    syncEffect({
      storeKey: "content-store",
      refine: ContentContextAtomChecker,
      itemKey: 'contentContextAtom',
      read: ({read}) => {
        return read('contentContextAtom')
      },
    }),
  ],
});

export default ContentContextAtom;

export const useUserContentValue = () => {
  return useRecoilValue(ContentContextAtom);
}

export const useUserContentState = () => {
  return useRecoilState(ContentContextAtom);
}