import { ContentContextAtom, ContentStorageList } from "../domain/content/ContentContext.atom";
import { ContentStorage } from "../domain/content/ContentStorage";
import { LocalstorageSyncProvider } from "../domain/storage/LocalstorageSync";
import { ContentNavigationMarker } from "./ContentNavigationMarker";

const contentStorage = new ContentStorage(ContentStorageList.contentContextAtom);

export const ContentApp = () => {
  return (
    <LocalstorageSyncProvider
      debugKey="content"
      storageAtom={ContentContextAtom}
      contentStorage={contentStorage}
    >
      <ContentNavigationMarker />
    </LocalstorageSyncProvider>
  );
};
