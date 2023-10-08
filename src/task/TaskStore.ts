import {
  Observable,
  catchError,
  distinctUntilChanged,
  finalize,
  map,
} from "rxjs";
import { StoreSubject } from "../core/StoreSubject";
import { nanoid } from "nanoid";

type Task<
  R = unknown,
  P extends Record<string, unknown> = Record<string, unknown>
> = (params?: TaskParams<P>) => Observable<R>;
type TaskParams<T extends Record<string, unknown> = Record<string, unknown>> = {
  tags: string[];
} & T;
type TaskNode = {
  task: Task;
  params?: TaskParams;
  status: TaskStatus;
  error?: any;
  result?: any;
};

type TaskStatus = "completed" | "idle" | "progress" | "error";

export class TaskAtom {
  private id: string = nanoid();
  constructor(
    store: StoreSubject<{
      tasks: Map<string, TaskNode>;
      nodesByTag: Map<string, string>;
    }>,
    private node: TaskNode
  ) {
    const state = store.getValue();
    const nodes = new Map(state.tasks);
    nodes.set(this.id, node);
    const tags = new Map(state.nodesByTag);
    this.node.params?.tags.forEach((tag) => {
      tags.set(tag, this.id);
    });
    const newTasks = new Map(store.getValue().tasks);
    newTasks.set(this.id, node);
    store.next({
      tasks: newTasks,
      nodesByTag: tags,
    });
  }

  dispose() {}

  getId() {
    return this.id;
  }

  getNode() {
    return { ...this.node };
  }
}

export class TaskStore extends StoreSubject<{
  tasks: Map<string, TaskNode>;
  nodesByTag: Map<string, string>;
}> {
  private static _instance = new TaskStore();

  protected constructor() {
    super({ tasks: new Map(), nodesByTag: new Map() });
  }

  updateNode(id: string, update: Partial<TaskNode>) {
    
    const state = new Map(this.value.tasks);
    const currentNode = state.get(id);
    if (currentNode) state.set(id, { ...currentNode, ...update });
  }

  subscribeTaskById(id: string) {
    return this.pipe(map(({ tasks }) => tasks.get(id), distinctUntilChanged()));
  }

  subscribeTaskByTagName(tag: string) {
    return this.pipe(
      map(({ tasks, nodesByTag }) => {
        const id = nodesByTag.get(tag) || "";
        return tasks.get(id);
      }, distinctUntilChanged())
    );
  }

  static createAtom<R = unknown>(task: Task<R>, params?: TaskParams) {
    const atom = new TaskAtom(TaskStore._instance, {
      task,
      params,
      status: "idle",
    });

    const node = atom.getNode();

    return {
      chargeAtom$: () => {
        return node.task(node.params)
      },
      plugAtom$: (stream$: Observable<any>) => {
        return stream$.pipe(
          finalize(() => {
            TaskStore._instance.getValue();
            this._instance.updateNode(atom.getId(), {
              status: "completed",
            });
          }),
          map((response: R) => {
            this._instance.updateNode(atom.getId(), { result: response });
            return response;
          }),
          catchError((err) => {
            this._instance.updateNode(atom.getId(), { error: err });
            return err;
          })
        );
      },
    };
  }
}
