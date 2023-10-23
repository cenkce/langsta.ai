import { ContentContextAtom, ContentStorage } from "../domain/content/ContentContext.atom";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import { ContentNavigationMarker } from "./ContentNavigationMarker";

export const ContentApp = () => {
  useLocalstorageSync({
    debugKey: "content",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });
  return (
    <ContentNavigationMarker />
  );
};
