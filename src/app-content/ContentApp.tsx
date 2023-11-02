import {
  ContentContextAtom,
  ContentStorage,
} from "../domain/content/ContentContext.atom";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { ContentNavigationMarker } from "./ContentNavigationMarker";
import { useAtom } from "../api/core/useAtom";
import { useEffect } from "react";
import { setSelectedText } from "../domain/utils/setSelectedText";

export const ContentApp = () => {
  useLocalstorageSync({
    debugKey: "content",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });

  const [content] = useAtom(ContentContextAtom);
  useEffect(() => {
    if (content.selectedText && content.selectedText.selectors) {
      const [anchor, focus] = content.selectedText.selectors
      setSelectedText(anchor, focus);
    }
  }, [content]);

  return <ContentNavigationMarker />;
};
