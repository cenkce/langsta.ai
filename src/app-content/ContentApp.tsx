import {
  ContentContextAtom,
  ContentStorage,
  useUserContentSetState,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentMarkerBadge,
  ContentMarkerBadgeType,
} from "./ContentMarkerBadge";
import { useAtom } from "../api/core/useAtom";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { setSelectedText } from "../domain/utils/setSelectedText";
import { useTranslateService } from "../domain/translation/TranslationService";
import {
  getSelectedText,
  getSelectedTextSelectors,
} from "../domain/utils/getSelectedText";
import { ShadowDom } from "../api/core/ShadowRoot";

export const ContentApp = () => {
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
    if (content.selectedText && content.selectedText.selectors) {
      const [anchor, focus] = content.selectedText.selectors;
      setSelectedText(anchor, focus);
    }
  }, [content]);

  return (
    <ShadowDom parentElement={parentElement}>
      <ContentCaptureContainer />
    </ShadowDom>
  );
};

export const ContentCaptureContainer = () => {
  const setUserContent = useUserContentSetState();
  const [markers, setMarkers] = useState<ContentMarkerBadgeType[]>([]);
  const { translate } = useTranslateService();
  const [selectedText] = useUserContentState();
  // const setMarkerPosition = (
  //   markerPosition: Record<string, number | string>
  // ) => {
  //   if (markerRef.current) {
  //     markerRef.current.style.left = markerPosition.left + "px";
  //     markerRef.current.style.top = markerPosition.top + "px";
  //   }
  // };

  useLayoutEffect(() => {
    const globalClickHandler = (e: MouseEvent) => {
      const selectedText = getSelectedText().trim();
      if (getSelectedText().trim().length > 0) {
        setUserContent((state) => ({
          ...state,
          selectedText: {
            text: selectedText,
            selectors: getSelectedTextSelectors(),
          },
        }));
        setMarkers((markers) => [
          ...markers,
          {
            id: Date.now().toString(),
            left: e.pageX,
            top: e.pageY,
            visible: true,
            loading: false,
            clicked: false,
            selectedText: selectedText,
          },
        ]);
      }
    };
    document.addEventListener("click", globalClickHandler);

    // const handler = () => {
    //   if (getSelectedText()?.length === 0) {
    //     setMarkerPosition({
    //       left: -60,
    //       top: -60,
    //     });
    //   }
    // };

    // document.addEventListener("selectionchange", handler);

    return () => {
      // document.removeEventListener("selectionchange", handler);
      document.removeEventListener("click", globalClickHandler);
    };
  }, [selectedText]);

  // const hideMarker = () => {
  //   setMarkerPosition({
  //     left: -60,
  //     top: -60,
  //   });
  // };

  return markers
    .filter((marker) => marker.visible)
    .map((marker) => {
      return (
        <ContentMarkerBadge
          key={marker.id}
          {...marker}
          onClick={() => translate(marker.selectedText)}
        />
      );
    });
};
