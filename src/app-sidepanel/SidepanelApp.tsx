import {
  TranslationTextTask,
  deleteTranslation,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { ContentMessageDispatch } from "../domain/content/messages";
import { FlexRow } from "../ui/FlexRow";
import { LoadingIcon } from "../ui/icons/LoadingIcon";
import { TrashIcon } from "../ui/icons/TrashIcon";
import styles from "./SidepanelApp.module.scss";

document.documentElement.classList.remove('dark')

export const SidepanelApp = () => {
  const [userContent] = useUserContentState();
  const tasks = Object.values(userContent?.translation || {});

  return (
    <div>
      <h2>Learn Smarter</h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          overflowX: "hidden",
        }}
      >
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
    </div>
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
    <div className={styles.translationItem} style={{ fontSize: "12px" }}>
      <pre id="definition-text" style={{ whiteSpace: "break-spaces" }}>
        {task?.selectedText.replaceAll("\n", "\n\n")}
      </pre>
      {task.status === "progress" ? (
        <FlexRow className={styles['translationItem_translation']}>
          <LoadingIcon />
          translating ...
        </FlexRow>
      ) : (
        <pre
          className={`${styles['translationItem_translation']}`}
        >
          {task.result?.trim().replaceAll("\n", "\n\n")}
        </pre>
      )}
      <FlexRow className="place-content-between ">
        <TrashIcon onClick={() => onDelete(task.taskId || "")}></TrashIcon>
        <div>{new Date(task.createdAt).toLocaleString()}</div>
      </FlexRow>
    </div>
  );
};
