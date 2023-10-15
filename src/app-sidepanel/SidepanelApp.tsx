import {
  TranslationTask,
  deleteTranslation,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import { ContentMessageDispatch } from "../domain/content/messages";
import { FlexRow } from "../ui/FlexRow";
import { LoadingIcon } from "../ui/icons/LoadingIcon";
import { TrashIcon } from "../ui/icons/TrashIcon";

export const SidepanelApp = () => {
  const [userContent] = useUserContentState();
  const tasks = Object.values(userContent?.translation || {});

  return (
    <div>
      <h2>Learn Smarter</h2>
      {tasks.map((task) => {
        return <TranslationItem key={task.taskId} onDelete={(id) => {
          deleteTranslation(id);
          ContentMessageDispatch({
            type: 'backend/delete-task',
            payload: {
              task: id
            }
          });
        }} task={task} />;
      })}
    </div>
  );
};

const TranslationItem = ({ task, onDelete }: { onDelete: (taskId: string) => void, task: TranslationTask }) => {
  return (
    <div>
      <p id="definition-text">{task?.selectedText}</p>
      <p id="definition-text-tranlation">
        {task.status === "progress" ? (
          <FlexRow>
            <LoadingIcon />
            translating ...
          </FlexRow>
        ) : (
          task.result?.translation
        )}
      </p>
      <FlexRow>
         <TrashIcon onClick={() => onDelete(task.taskId || '')}></TrashIcon>
      </FlexRow>
    </div>
  );
};
