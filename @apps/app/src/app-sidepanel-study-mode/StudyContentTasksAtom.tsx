import { StoreSubject, Atom } from "@espoojs/atom";
import { ContentStudyActionsIconsSlugsType } from "./ContentStudyActionsBar";

const studyContentTasksStore = new StoreSubject({} as {
  [key in ContentStudyActionsIconsSlugsType]?: string;
});
export const studyContentTasksAtom = Atom.of(studyContentTasksStore);
studyContentTasksAtom.get$('content');
studyContentTasksAtom.set$({'content': 'task-id'});
