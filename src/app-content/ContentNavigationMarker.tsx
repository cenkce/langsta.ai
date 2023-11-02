import { useLayoutEffect, useRef } from "react";
import { getSelectedText, getSelectedTextSelectors } from "../domain/utils/getSelectedText";
import { ContentMessageDispatch } from "../domain/content/messages";
import { useUserContentSetState } from "../domain/content/ContentContext.atom";
import { useTranslateService } from "../domain/translation/TranslationService";
import styles from './ContentNavigationMarker.module.scss';
import logoUrl from '../assets/logo.png'
import { ImageIcon } from "../ui/icons/ImageIcon";

export const ContentNavigationMarker = () => {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const setUserContent = useUserContentSetState();
  const { translate } = useTranslateService();
  
  const setMarkerPosition = (
    markerPosition: Record<string, number | string>
  ) => {
    if (markerRef.current) {
      markerRef.current.style.left = markerPosition.left + "px";
      markerRef.current.style.top = markerPosition.top + "px";
    }
  };

  useLayoutEffect(() => {
    const globalClickHandler = (e: MouseEvent) => {
      if (getSelectedText().trim().length > 0) {
        setUserContent((state) => ({
          ...state,
          selectedText: {
            text: getSelectedText(),
            selectors: getSelectedTextSelectors(),
          },
        }));
        setMarkerPosition({
          left: e.pageX,
          top: e.pageY,
        });
      } else {
        setMarkerPosition({
          left: -60,
          top: -60,
        });
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
  }, []);

  const hideMarker = () => {
    setMarkerPosition({
      left: -60,
      top: -60,
    });
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        ContentMessageDispatch({
          type: "define-selected-text",
        });
        translate();
        hideMarker();
      }}
      className={styles.marker}
      style={{
        zIndex: Number.MAX_SAFE_INTEGER
      }}
      ref={markerRef}
    >
     <ImageIcon iconUrl={logoUrl} />
    </div>
  );
};
