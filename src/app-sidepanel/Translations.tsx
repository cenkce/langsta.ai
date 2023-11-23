import {
  deleteTranslation,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { TranslationTextTask } from "../api/task/TranslationTextTask";
import { serviceWorkerContentMessageDispatch } from "../domain/content/messages";
import { FlexRow } from "../ui/FlexRow";
import { LoadingIcon } from "../ui/icons/LoadingIcon";
import { TrashIcon } from "../ui/icons/TrashIcon";
import styles from "./SidepanelApp.module.scss";
import { Button } from "../ui/Button";
import { currentTabMessageDispatch } from "../domain/content/currentTabMessageDispatch";

export const Translations = () => {
  const [userContent] = useUserContentState();
  const tasks = Object.values(userContent?.translation || {});
  return tasks
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((task) => {
      return (
        <TranslationRow
          key={task.taskId}
          onShowSelection={(task) =>{
            console.log(task);
            currentTabMessageDispatch({
              type: 'select-content',
              task: task
            })
          }}
          onDelete={(id) => {
            deleteTranslation(id);
            serviceWorkerContentMessageDispatch({
              type: "backend/delete-task",
              payload: {
                task: id,
              },
            });
          }}
          task={task}
        />
      );
    });
};
const TranslationRow = ({
  task,
  onDelete,
  onShowSelection
}: {
  onDelete: (taskId: string) => void;
  onShowSelection: (taskId: TranslationTextTask) => void;
  task: TranslationTextTask;
}) => {
  return (
    <div
      className={`${styles.translationItem} collapse collapse-arrow bg-base-200 `}
      style={{ fontSize: "12px" }}
    >
      <input type="radio" name={"sidebar-translations"} />
      <div className={styles.title}>
        <pre style={{ whiteSpace: "break-spaces" }}>
          {task?.selection?.text.trim().replaceAll("\n", "\n\n")}
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
        <TrashIcon
          className="btn btn-circle btn-xs text-error p-1 box-content scale-75"
          onClick={() => onDelete(task.taskId || "")}
        ></TrashIcon>
        <Button onClick={() => onShowSelection(task)} size="xs" variant="ghost" color="primary">
          Show Selection
        </Button>
        <div className="btn-primary">
          {new Date(task.createdAt).toLocaleString()}
        </div>
      </FlexRow>
    </div>
  );
};
