import { useLayoutEffect, useRef } from "react";
import { getSelectedText } from "../domain/utils/getSelectedText";
import { emitContentMessage } from "../domain/content/messages";
import { useUserContentSetState } from "../domain/content/ContentContext.atom";
import { useTranslateService } from "../domain/translation/TranslationService";

export const ContentNavigationMarker = () => {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const setUserContent = useUserContentSetState();
  const { translate } = useTranslateService();
  useLayoutEffect(() => {
    const globalClickHandler = (e: MouseEvent) => {
      if (getSelectedText().trim().length > 0) {
        setUserContent((state) => ({
          ...state,
          selectedText: getSelectedText(),
        }));
        setMarkerPosition({
          left: e.pageX,
          top: e.pageY,
        });
      } else {
        setMarkerPosition({
          left: 0,
          top: 0,
        });
      }
    };
    document.addEventListener("click", globalClickHandler);

    const handler = () => {
      if (getSelectedText()?.length === 0) {
        setMarkerPosition({ display: "none" });
      }
    };

    document.addEventListener("selectionchange", handler);

    const setMarkerPosition = (
      markerPosition: Record<string, number | string>
    ) => {
      if (markerRef.current) {
        markerRef.current.style.left = markerPosition.left + "px";
        markerRef.current.style.top = markerPosition.top + "px";
      }
    };

    return () => {
      document.removeEventListener("selectionchange", handler);
      document.removeEventListener("click", globalClickHandler);
    };
  }, []);

  // const hideMarker = () => {
  //   setMarkerPosition({
  //     left: -60,
  //     top: -60,
  //   });
  // };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        emitContentMessage({
          type: "define-selected-text",
        });
        translate();
      }}
      style={{
        width: "35px",
        height: "35px",
        position: "absolute",
        cursor: "pointer",
        zIndex: Number.MAX_SAFE_INTEGER,
        borderRadius: "25%",
        backgroundColor: "red",
      }}
      ref={markerRef}
    >
      {" "}
    </div>
  );
};
