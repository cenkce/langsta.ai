import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentContextAtom,
  ContentStorage,
  TranslationTextTask,
  deleteTranslation,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { ContentMessageDispatch } from "../domain/content/messages";
import { ArtBoard } from "../ui/ArtBoard";
import { FlexRow } from "../ui/FlexRow";
import { LoadingIcon } from "../ui/icons/LoadingIcon";
import { TrashIcon } from "../ui/icons/TrashIcon";
import styles from "./SidepanelApp.module.scss";

export const SidepanelApp = () => {
  const [userContent] = useUserContentState();
  const tasks = Object.values(userContent?.translation || {});
  
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
        {tasks
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((task) => {
            return (
              <TranslationRow
                key={task.taskId}
                onDelete={(id) => {
                  deleteTranslation(id);
                  ContentMessageDispatch({
                    type: "backend/delete-task",
                    payload: {
                      task: id,
                    },
                  });
                }}
                task={task}
              />
            );
          })}
      </div>
    </ArtBoard>
  );
};

const TranslationRow = ({
  task,
  onDelete,
}: {
  onDelete: (taskId: string) => void;
  task: TranslationTextTask;
}) => {
  return (
    <div className={`${styles.translationItem} collapse collapse-arrow bg-base-200 `} style={{ fontSize: "12px" }}>
      <input type="radio" name={"sidebar-translations"} />
      <div className={styles.title}>
        <pre style={{ whiteSpace: "break-spaces" }}>
          {task?.selectedText.trim().replaceAll("\n", "\n\n")}
        </pre>
      </div>
      <div className="collapse-content">
        {task.status === "progress" ? (
          <FlexRow className={styles.content}>
            <LoadingIcon />
            translating ...
          </FlexRow>
        ) : (
          <pre className={`${styles.content} text-neutral-600`}>
            {task.result?.trim().replaceAll("\n", "\n\n")}
          </pre>
        )}
      </div>
      <FlexRow className="place-content-between">
        <TrashIcon onClick={() => onDelete(task.taskId || "")}></TrashIcon>
        <div>{new Date(task.createdAt).toLocaleString()}</div>
      </FlexRow>
    </div>
  );
};
