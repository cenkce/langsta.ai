import {
  deleteTranslation,
  useUserContentState
} from "../domain/content/ContentContext.atom";
import { TranslationTextTask } from "../api/task/TranslationTextTask";
import { ContentMessageDispatch } from "../domain/content/messages";
import { FlexRow } from "../ui/FlexRow";
import { LoadingIcon } from "../ui/icons/LoadingIcon";
import { TrashIcon } from "../ui/icons/TrashIcon";
import styles from "./SidepanelApp.module.scss";

export const Translations = () => {
  const [userContent] = useUserContentState();
  const tasks = Object.values(userContent?.translation || {});
  console.log(userContent);
  return tasks
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
          task={task} />
      );
    });
};
const TranslationRow = ({
  task, onDelete,
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
