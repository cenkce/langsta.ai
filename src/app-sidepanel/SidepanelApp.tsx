import {
  TranslationTextTask,
  deleteTranslation,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { ContentMessageDispatch } from "../domain/content/messages";
import { FlexRow } from "../ui/FlexRow";
import { LoadingIcon } from "../ui/icons/LoadingIcon";
import { TrashIcon } from "../ui/icons/TrashIcon";
import styles from './SidepanelApp.module.scss';

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
        {tasks.map((task) => {
          return (
            <TranslationItem
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

const TranslationItem = ({
  task,
  onDelete,
}: {
  onDelete: (taskId: string) => void;
  task: TranslationTextTask;
}) => {
  return (
    <div className={styles.translationItem} style={{ fontSize: "12px" }}>
      <pre id="definition-text" style={{ whiteSpace: "break-spaces" }}>
        {task?.selectedText.replaceAll('\n', '\n\n')}
      </pre>
      {task.status === "progress" ? (
        <FlexRow>
          <LoadingIcon />
          translating ...
        </FlexRow>
      ) : (
        <pre className={styles.translationItem_translate} style={{ whiteSpace: "break-spaces" }}>{task.result?.trim().replaceAll('\n', '\n\n')}</pre>
      )}
      <FlexRow>
        <TrashIcon onClick={() => onDelete(task.taskId || "")}></TrashIcon>
      </FlexRow>
    </div>
  );
};
