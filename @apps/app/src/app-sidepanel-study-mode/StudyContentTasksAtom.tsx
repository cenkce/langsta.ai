import { StoreSubject, Atom } from "@espoojs/atom";
import { ContentStudyActionsIconsSlugsType } from "./ContentStudyActionsMenu";

const studyContentTasksStore = new StoreSubject({} as StudyContentState);
export type StudyContentState = {
  [key in ContentStudyActionsIconsSlugsType]?: string;
};
export const studyContentTasksAtom = Atom.of(studyContentTasksStore);
