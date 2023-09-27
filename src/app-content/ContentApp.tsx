import ContentContextAtom from "../domain/content/ContentContext.atom";
import { LocalstorageSyncProvider } from "../domain/storage/LocalstorageSync";
import { ContentNavigationMarker } from "./ContentNavigationMarker";

export const ContentApp = () => {
  return (
    <LocalstorageSyncProvider debugKey="content" storageAtom={ContentContextAtom}>
      <ContentNavigationMarker />
    </LocalstorageSyncProvider>
  );
};
