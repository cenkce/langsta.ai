import { useUserContentSetState } from "../domain/content/ContentContext.atom";
import {
  ContentMarkerBadge,
  ContentMarkerBadgeType,
} from "./ContentMarkerBadge";
import { useRef, useState } from "react";
import {
  getSelectedText,
  getSelectedTextSelectors,
} from "../domain/utils/getSelectedText";
import { useGlobalMouseEventHandlerService } from "../api/utils/useGlobalMouseEventHandlerService";

export const ContentCaptureContainer = () => {
  const setUserContent = useUserContentSetState();
  const [markers, setMarkers] = useState<ContentMarkerBadgeType[]>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  // const { translate } = useTranslateService();
  // const [selectedText] = useUserContentState();

  useGlobalMouseEventHandlerService({
    excludeTargetClassNames: ["ContentMarkerBadge"],
    rootRef,
    onOutsideClick: (e: MouseEvent) => {
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
            text: selectedText,
          },
        ]);
      } else {
        setMarkers([]);
      }
    },
  });
  useGlobalMouseEventHandlerService({
    excludeTargetClassNames: ["ContentMarkerBadge"],
    rootRef,
    type: 'mousedown',
    onOutsideClick: () => {
      setMarkers([]);
    },
  });

  return (
    <>
      <div ref={rootRef} className={"content-app-root"} data-theme={"cupcake"}>
        {markers
          .filter((marker) => marker.visible)
          .map((marker) => {
            return (
              <ContentMarkerBadge
                key={marker.id}
                {...marker}
                onClick={(ev) => {
                  setMarkers((state) =>
                    state.map((marker) =>
                      ev.id === marker.id
                        ? { ...marker, clicked: true }
                        : marker
                    )
                  );
                }}
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
