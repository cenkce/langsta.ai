import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentContextAtom,
  ContentStorage,
} from "../domain/content/ContentContext.atom";
import { ArtBoard } from "../ui/ArtBoard";
import styles from "./SidepanelApp.module.scss";
import { Translations } from "./Translations";

export const SidepanelApp = () => {
  
  useLocalstorageSync({
    debugKey: "content-sidepanel",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });

  return (
    <ArtBoard
      title="Langsta"
      subtitle="Self-taught Language Asistant"
      theme="cupcake"
    >
      <div className={styles.container}>
        <Translations />
      </div>
    </ArtBoard>
  );
};

