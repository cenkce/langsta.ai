import {
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  takeUntil,
} from "rxjs";
import { StoreSubject } from "../core/StoreSubject";
import { nanoid } from "nanoid";

export type Task<
  R = unknown,
  P extends Record<string, unknown> | undefined = undefined
> = (params: TaskParams<P>) => Observable<R>;
export type TaskParams<
  T extends Record<string, unknown> | undefined = undefined
> = T extends undefined
  ? {
      tags: string[];
    }
  : {
      tags: string[];
    } & T;
export type TaskNode<R = unknown, P extends Record<string, unknown> | undefined = undefined> = {
  task: Task<R, P>;
  params?: TaskParams<P>;
  status: TaskStatus;
  error?: any;
  result?: any;
};

type TaskStatus = "completed" | "idle" | "progress" | "error";

export class TaskAtom<R = unknown, P extends Record<string, unknown> | undefined = undefined> {
  private id: string = nanoid();
  constructor(
    store: StoreSubject<{
      tasks: Map<string, TaskNode<unknown, any>>;
      nodesByTag: Map<string, string>;
    }>,
    private node: TaskNode<R, P>
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
  tasks: Map<string, TaskNode<unknown, any>>;
  nodesByTag: Map<string, string>;
}> {
  private static _instance = new TaskStore();

  static get instance() {
    return this._instance;
  }

  protected constructor() {
    super({ tasks: new Map(), nodesByTag: new Map() });
  }

  updateNode(id: string, update: Partial<TaskNode<unknown, any>>) {
    const tasks = new Map(this.value.tasks);
    const currentNode = tasks.get(id);
    if (currentNode) tasks.set(id, { ...currentNode, ...update });
    this.next({ tasks, nodesByTag: this.value.nodesByTag });
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

  static createAtom<
    R = unknown,
    P extends Record<string, unknown> | undefined = undefined
  >(task: Task<R, P>, params?: TaskParams<P>) {
    const atom = new TaskAtom<R, P>(TaskStore._instance, {
      task,
      params,
      status: "idle",
    });

    const node = atom.getNode();
    const completeSubject = new Subject<any>();

    return {
      id: atom.getId(),
      completeTask: () => {
        completeSubject.next(null);
      },
      chargeAtom$: () => {
        return node.task((node.params || { tags: [] }) as TaskParams<P>);
      },
      plugAtom$: (stream$: Observable<R>) => {
        return stream$.pipe(
          finalize(() => {
            TaskStore._instance.getValue();
            completeSubject.complete();
            this._instance.updateNode(atom.getId(), {
              status: "completed",
            });
          }),
          catchError((err, caught) => {
            this._instance.updateNode(atom.getId(), { error: err });
            return caught;
          }),
          takeUntil(completeSubject),
          map((response) => {
            this._instance.updateNode(atom.getId(), { result: response });
            return response;
          }),
        );
      },
    };
  }
}
