import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentContextAtom,
  ContentStorage,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { ArtBoard } from "../ui/ArtBoard";
import { StudyToolbar } from "./StudyToolBar";
import styles from "./SidepanelApp.module.scss";
import { useTranslateService } from "../domain/translation/TranslationService";
import { SettingsAtom, SettingsStorage } from "../domain/user/SettingsModel";
import { useState } from "react";

export const SidepanelApp = () => {
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  useLocalstorageSync({
    debugKey: "content-sidepanel-study-mode",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });

  useLocalstorageSync({
    debugKey: "settings-sidepanel",
    storageAtom: SettingsAtom,
    contentStorage: SettingsStorage,
  });

  const { simplify, summarise } = useTranslateService();
  const [userContent] = useUserContentState();
  const tasks = Object.values(userContent?.contentTasks || {});
  const task = tasks.find((task) => {
    return task.taskId === taskId;
  });

  console.log("content task", task);

  return (
    <ArtBoard>
      <div className={styles.container}>
        <StudyToolbar
          onClick={(link) => {
            if (link === "Summarise") {
              setTaskId(summarise(userContent.activeTabContent.textContent));
            } else if (link === "Simplify") {
              setTaskId(simplify(userContent.activeTabContent.textContent));
            }
          }}
        />
        <main className={styles.content}>
          <h1>{userContent.activeTabContent.title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html:
                task?.status === "completed"
                  ? task.result || ""
                  : userContent.activeTabContent.content,
            }}
          />
        </main>
      </div>
    </ArtBoard>
  );
};
