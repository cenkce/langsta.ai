import { ShadowDom } from "@espoojs/utils";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { ContentContextAtom, ContentStorage } from "../domain/content/ContentContext.atom";
import { useMemo } from "react";

export const ContentApp = () => {
  // const [styles] = useAtom(StyleContextAtom);
  useLocalstorageSync({
    debugKey: "content",
    verbose: true,
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });
  // const url = getSanitizedUrl();

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
        {/* {Object.values(styles).join("\r\n")} */}
      </style>
      {/* <ContentCaptureContainer /> */}
    </ShadowDom>
  );
};
