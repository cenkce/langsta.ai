import { TranslationTextTask } from "../../api/task/TranslationTextTask";



export type TabMessageGetPageContent = {
  type: 'get-page-content';
};

export type TabMessageSelectContent = {
  type: 'select-content';
  task: TranslationTextTask;
};

export type TabMessages = TabMessageSelectContent | TabMessageGetPageContent;
