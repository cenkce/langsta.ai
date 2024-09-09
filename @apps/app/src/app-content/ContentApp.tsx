import { useAtom } from "@espoojs/atom";
import { StyleContextAtom } from "./styles";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { ContentContextAtom, ContentStorage, useUserContentState } from "../domain/content/ContentContext.atom";
import { useEffect } from "react";
import { getSanitizedUrl } from "../api/utils/getSanitizedUrl";

export const ContentApp = () => {
  // const [styles] = useAtom(StyleContextAtom);
  const url = getSanitizedUrl();
  useLocalstorageSync({
    debugKey: "content",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });
  const {activeTabUrl} = useUserContentState();
  console.log('getSanitizedUrl : ', activeTabUrl, getSanitizedUrl())

  useEffect(() => {
    if(activeTabUrl !== url) {
      ContentContextAtom.set$({activeTabUrl: url});
    }
  }, [activeTabUrl, url]);

  // const parentElement = useMemo(
  //   () => document.querySelector("#__contentAppllicationRoot__"),
  //   [],
  // );

  // return (
  //   <ShadowDom parentElement={parentElement} mode={__DEV__ ? "open" : "closed"}>
  //     <style>
  //       {`
  //     :host {
  //       font-size: 20px !important;
  //     }
  //     `}
  //       {Object.values(styles).join("\r\n")}
  //     </style>
  //     <ContentCaptureContainer />
  //   </ShadowDom>
  // );
  return <></>
};

export const useAddStyleAtom = () => {
  return useAtom(StyleContextAtom, { noStateUpdate: true });
};
