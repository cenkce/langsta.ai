import {
  ContentContextAtom,
  ContentStorage,
} from "../domain/content/ContentContext.atom";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { useAtom } from "../api/core/useAtom";
import { useMemo } from "react";
import { ShadowDom } from "../api/core/ShadowRoot";
import { ContentCaptureContainer } from "./SelectionHandlingContainer";
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

  return (
    <ShadowDom parentElement={parentElement} mode={__DEV__ ? 'open' : 'closed'}>
      <style>
      {`
      :host {
        font-size: 20px !important;
      }
      `}
        {Object.values(styles).join('\r\n')}
      </style>
      <ContentCaptureContainer  />
    </ShadowDom>
  );
};

export const useAddStyleAtom = () => {
  return useAtom(StyleContextAtom, true);
};
