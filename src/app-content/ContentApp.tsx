import {
  ContentContextAtom,
  ContentStorage,
} from "../domain/content/ContentContext.atom";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { useAtom } from "../api/core/useAtom";
import { useEffect, useMemo } from "react";
import { ShadowDom } from "../api/core/ShadowRoot";
import { ContentCaptureContainer } from "./ContentCaptureContainer";
import { StyleContextAtom } from "./styles";


export const ContentApp = () => {
  const [styles] = useAtom(StyleContextAtom);

  useLocalstorageSync({
    debugKey: "content",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });

  const parentElement = useMemo(
    () => document.querySelector("#__contentAppllicationRoot__"),
    []
  );

  const [content] = useAtom(ContentContextAtom);
  useEffect(() => {
    if (content.selectedText?.text.trim() && content.selectedText.selectors) {
      // const [anchor, focus] = content.selectedText.selectors;
      // setSelectedText(anchor, focus);
    }
  }, [content.selectedText?.text]);

  return (
    <ShadowDom parentElement={parentElement} mode={__DEV__ ? 'open' : 'closed'}>
      <style>
        {Object.values(styles).join('\n\n')}
      </style>
      <ContentCaptureContainer />
    </ShadowDom>
  );
};

export const useAddStyleAtom = () => {
  return useAtom(StyleContextAtom, true);
};
