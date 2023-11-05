import {
  useUserContentSetState,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import {
  ContentMarkerBadge,
  ContentMarkerBadgeType,
} from "./ContentMarkerBadge";
import { useLayoutEffect, useState } from "react";
import {
  getSelectedText,
  getSelectedTextSelectors,
} from "../domain/utils/getSelectedText";

export const ContentCaptureContainer = () => {
  const setUserContent = useUserContentSetState();
  const [markers, setMarkers] = useState<ContentMarkerBadgeType[]>([]);
  // const { translate } = useTranslateService();
  const [selectedText] = useUserContentState();

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

  return (
    <>
      <div className={"content-app-root"} data-theme={"cupcake"}>
        {markers
          .filter((marker) => marker.visible)
          .map((marker) => {
            return (
              <ContentMarkerBadge
                key={marker.id}
                {...marker}
                onClose={(ev) => {
                  setMarkers((state) =>
                    state.filter((marker) => ev.id !== marker.id)
                  );
                }}
                // onClick={() => translate(marker.selectedText)}
              />
            );
          })}
      </div>
    </>
  );
};
