import { ContentContextAtom, ContentStorage } from "../domain/content/ContentContext.atom";
import { LocalstorageSyncProvider } from "../api/storage/LocalstorageSync";
import { ContentNavigationMarker } from "./ContentNavigationMarker";

export const ContentApp = () => {
  return (
    <LocalstorageSyncProvider
      debugKey="content"
      storageAtom={ContentContextAtom}
      contentStorage={ContentStorage}
    >
      <ContentNavigationMarker />
    </LocalstorageSyncProvider>
  );
};
