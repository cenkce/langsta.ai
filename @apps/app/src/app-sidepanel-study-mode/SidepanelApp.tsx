import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentContextAtom,
  ContentStorage,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { ArtBoard } from "../ui/ArtBoard";
import { StudyToolbar } from "./StudyToolBar";
import styles from "./SidepanelApp.module.scss";

export const SidepanelApp = () => {
  useLocalstorageSync({
    debugKey: "content-sidepanel-study-mode",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });

  const [userContent] = useUserContentState();

  return (
    <ArtBoard>
      <div className={styles.container}>
        <StudyToolbar></StudyToolbar>
        <main className={styles.content}>
          <h1>{userContent.activeTabContent.title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: userContent.activeTabContent.content,
            }}
          />
        </main>
      </div>
    </ArtBoard>
  );
};
