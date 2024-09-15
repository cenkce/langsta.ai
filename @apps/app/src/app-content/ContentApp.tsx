import { ShadowDom } from "@espoojs/utils";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentContextAtom,
  ContentStorage,
} from "../domain/content/ContentContext.atom";
import { useMemo } from "react";
import "./styles.tsx";
import { useAtom } from "@espoojs/atom";
import { StyleContextAtom } from "./styles";
import MantainStyle from '@mantine/core/styles.css?inline';

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
        {MantainStyle}
        {Object.values(styles).join("\r\n")}
      </style>
    </ShadowDom>
  );
};
