import { useAtom } from "@espoojs/atom";
import { useMemo } from "react";
import { ShadowDom } from "@espoojs/utils";
import { ContentCaptureContainer } from "./SelectionHandlingContainer";
import { StyleContextAtom } from "./styles";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { ContentContextAtom, ContentStorage } from "../domain/content/ContentContext.atom";

export const ContentApp = () => {
  const [styles] = useAtom(StyleContextAtom);

  useLocalstorageSync({
    debugKey: "content",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });

  const parentElement = useMemo(
    () => document.querySelector("#__contentAppllicationRoot__"),
    [],
  );

  return (
    <ShadowDom parentElement={parentElement} mode={__DEV__ ? "open" : "closed"}>
      <style>
        {`
      :host {
        font-size: 20px !important;
      }
      `}
        {Object.values(styles).join("\r\n")}
      </style>
      <ContentCaptureContainer />
    </ShadowDom>
  );
};

export const useAddStyleAtom = () => {
  return useAtom(StyleContextAtom, { noStateUpdate: true });
};
