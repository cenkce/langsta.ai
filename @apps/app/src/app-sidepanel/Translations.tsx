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
import { useState } from "react";
import { classNames } from "@espoojs/utils";

export const Translations = (props: {
  onFilter?: (translation: TranslationTextTask) => boolean;
}) => {
  const userContent = useUserContentState();
  const tasks = Object.values(userContent?.translation || {});
  const [selectedTranslation, setSelectedTranslation] = useState<
    string | undefined
  >();

  return (props.onFilter ? tasks.filter(props.onFilter) : tasks)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((task, i) => {
      return (
        <TranslationRow
          key={task.taskId}
          selected={
            selectedTranslation ? selectedTranslation === task.taskId : i === 0
          }
          onClick={setSelectedTranslation}
          onShowSelection={(task) => {
            currentTabMessageDispatch({
              type: "select-content",
              task: task,
            });
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
  onShowSelection,
  onClick,
  selected,
}: {
  selected: boolean;
  onDelete: (taskId: string) => void;
  onShowSelection: (taskId: TranslationTextTask) => void;
  onClick: (taskId?: string) => void;
  task: TranslationTextTask;
}) => {
  const classes = classNames(
    "collapse collapse-arrow",
    selected,
    "collapse-open"
  );
  return (
    <div className={classNames(styles.translationItem, "bg-base-200")}>
      <div className={classes}>
        <input
          type="radio"
          name={"sidebar-translations"}
          onClick={() => onClick(task?.taskId)}
        />
        <div className={styles.title}>
          <pre style={{ whiteSpace: "break-spaces" }}>
            {task?.selection?.text.trim().replaceAll("\n", "\r\n")}
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
              {task.result?.trim().replaceAll("\n", "\r\n")}
            </pre>
          )}
        </div>
      </div>
      <FlexRow className="place-content-between text-xs">
        <TrashIcon
          className="btn btn-circle btn-xs text-error p-1 box-content scale-75"
          onClick={() => onDelete(task.taskId || "")}
        />
        <Button
          onClick={() => onShowSelection(task)}
          size="xs"
          variant="ghost"
          color="primary"
        >
          Show Selection
        </Button>
        <div className="btn-primary">
          {new Date(task.createdAt).toLocaleString()}
        </div>
      </FlexRow>
    </div>
  );
};
