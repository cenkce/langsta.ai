import { ContentContextState } from "../../domain/content/ContentContext.atom";
import { TranslationTextTask } from "../task/TranslationTextTask";

export type TabMessages = {
  type: 'select-content',
  task: TranslationTextTask,
  selection: ContentContextState['selectedText']
};

export const sendMessagetoCurrentTab = async (message: TabMessages) => {
  const queryOptions = { active: true, currentWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);

  if (tabs?.[0]?.id)
    chrome.tabs.sendMessage(
      tabs[0].id,
      message,
      function (response) {
        console.log(response.status);
      }
    );
};
