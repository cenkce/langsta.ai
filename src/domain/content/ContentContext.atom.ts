import { atom, useRecoilState, useRecoilValue } from "recoil";
import { syncEffect } from "recoil-sync";
import { nullable, number, object, string, voidable } from "@recoiljs/refine";

const ContentContextAtomChecker = object({
  selectedText: voidable(string()),
  activeTabContent: nullable(voidable(object({
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
});

export const ContentContextAtom = atom({
  key: "contentContextAtom",
  default: {
    selectedText: undefined,
    activeTabContent: undefined
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

export const ContentContextSubscriber = () => {
  // const [, setContentState] = useRecoilState(ContentContextAtom);
  // useEffect(() => {
  //   chrome.runtime.onMessage.addListener((message) => {
  //     console.log('contentMessagesEmitter : ', message);
  //     if (message.type === "define-selected-text") {
  //       setContentState((state) => ({
  //         ...state,
  //         selectedText: message.payload,
  //       }));
  //     } else if (message.type === "extract-tab-content") {
  //       setContentState((state) => ({
  //         ...state,
  //         activeTabContent: message.payload
  //           ? { ...message.payload }
  //           : undefined,
  //       }));
  //     }
  //   });
  // }, []);

  return null;
};

export const useUserContentValue = () => {
  return useRecoilValue(ContentContextAtom);
}

export const useUserContentState = () => {
  return useRecoilState(ContentContextAtom);
}