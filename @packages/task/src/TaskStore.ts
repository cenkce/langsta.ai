import {
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  share,
  takeUntil,
} from "rxjs";
import { nanoid } from "nanoid";
import { StoreSubject } from "@espoojs/atom";

export type Task<
  R = unknown, //Response
  P extends Record<string, unknown> | undefined = undefined, // Params
> = (params: TaskParams<P>) => Observable<R>;
export type DefaultTaskParams = {
  tags: string[];
  reserveTags?: boolean;
};
export type TaskParams<
  T extends Record<string, unknown> | undefined = undefined,
> = T extends undefined ? DefaultTaskParams : DefaultTaskParams & T;
export type TaskNode<
  R = unknown,
  P extends Record<string, unknown> | undefined = undefined,
> = {
  task: Task<R, P>;
  params?: TaskParams<P>;
  status: TaskStatus;
  error?: any;
  result?: any;
  id: string;
  createdAt: number;
};

export type TaskStatus = "completed" | "idle" | "progress" | "error";
export const TaskStatuses = [
  "completed",
  "idle",
  "progress",
  "error",
] as TaskStatus[];

type TaskStoreState<
  R = unknown,
  P extends Record<string, unknown> | undefined = undefined,
> = {
  tasks: Map<string, TaskNode<R, P>>;
  nodesByTag: Map<string, Set<string>>;
  recentTaskId?: string;
};
type TasksSubject = StoreSubject<TaskStoreState>;
export type TaskNodeParams<
  R,
  P extends Record<string, unknown> | undefined = undefined,
> = Omit<TaskNode<R, P>, "id" | "createdAt"> & { id?: string };
export class TaskAtom<
  R = unknown,
  P extends Record<string, unknown> | undefined = undefined,
> {
  private id: string;
  #createdAt = Date.now();

  constructor(
    store: TasksSubject,
    private nodeParams: TaskNodeParams<R, P>,
  ) {
    this.id = this.nodeParams?.id || nanoid();
    const state = store.getValue();
    const nodes = new Map(state.tasks);
    const node = {
      ...this.nodeParams,
      id: this.id,
      createdAt: this.createdAt,
    } as TaskNode;
    nodes.set(this.id, node);

    const newTasks = new Map(store.getValue().tasks);
    newTasks.set(this.id, node);
    store.next({
      ...state,
      tasks: newTasks,
      recentTaskId: this.id,
    });
  }

  get createdAt() {
    return this.#createdAt;
  }

  getId() {
    return this.id;
  }

  getNode() {
    return { ...this.nodeParams };
  }
}

export class TaskStore extends StoreSubject<TaskStoreState> {
  private static _instance: TaskStore;
  private static forceCancelSubject = new Subject<string>();

  static {
    this._instance = new TaskStore();
  }

  static get instance() {
    return this._instance;
  }

  protected constructor() {
    super({ tasks: new Map(), nodesByTag: new Map() });
  }

  hasNode(id: string) {
    return this.value.tasks.has(id);
  }

  createNode(node: TaskNode) {
    this.value.tasks.set(node.id, node);

    this.updateNode(node.id, node, true);
  }

  updateNode(
    id: string,
    update: Partial<TaskNode<unknown, any>>,
    force = false,
  ) {
    const tasks = new Map(this.value.tasks);
    const currentNode = tasks.get(id);

    // shallow check
    if (
      force === false &&
      Object.keys(update).some((key) => {
        return (
          currentNode &&
          !Object.is(
            (currentNode as Record<string, unknown>)[key],
            (update as Record<string, unknown>)[key],
          )
        );
      }) === false
    )
      return;

    const updateNode = { ...currentNode, ...update } as TaskNode;

    if (currentNode) tasks.set(id, updateNode);

    const nodesByTag = new Map(this.value.nodesByTag);
    currentNode?.params?.tags.forEach((tag) => {
      const tagMap = new Set(nodesByTag.get(tag));
      TaskStatuses.forEach((status) => tagMap.delete(`${status}_${id}`));
      tagMap.add(`${updateNode.status}_${id}`);
      nodesByTag.set(tag, tagMap);
    });

    this.next({ tasks, nodesByTag, recentTaskId: id });
  }

  static cancelTask(id: string) {
    this.forceCancelSubject.next(id);
  }

  subscribeTaskById(id: string) {
    return this.pipe(
      map(({ tasks }) => tasks.get(id)),
      distinctUntilChanged(),
      share(),
    );
  }

  subscribeTaskByTagName(
    tag: string,
    statuses: TaskStatus[] = ["idle", "progress"],
  ) {
    return this.pipe(
      map(
        ({ tasks, recentTaskId }) => {
          if (!recentTaskId) return null;

          const taskNode = tasks.get(recentTaskId);
          if (
            taskNode &&
            statuses.includes(taskNode.status) &&
            taskNode.params?.tags.includes(tag)
          ) {
            return taskNode;
          }

          return null;
        },
        distinctUntilChanged<TaskNode<unknown, any>[]>((prev, current) => {
          return (
            !!current &&
            current.some((taskNode, i) => Object.is(taskNode, prev[i]))
          );
        }),
      ),
      share(),
    );
  }

  static createTaskAtom<
    R = unknown,
    P extends Record<string, unknown> | undefined = undefined,
  >(task: Task<R, P>, params?: TaskParams<P>, id?: string) {
    const atom = new TaskAtom<R, P>(TaskStore._instance, {
      task,
      params,
      status: "idle",
      id,
    });

    const node = atom.getNode();
    return {
      id: atom.getId(),
      createdAt: atom.createdAt,
      cancelTask: () => {
        this.cancelTask(atom.getId());
      },
      chargeAtom$: () => {
        return node.task((node.params || { tags: [] }) as TaskParams<P>);
      },
      plugAtom$: (stream$: Observable<R>) => {
        this._instance.updateNode(atom.getId(), {
          status: "progress",
        });

        return stream$.pipe(
          finalize(() => {
            this._instance.updateNode(atom.getId(), {
              status: "completed",
            });
          }),
          takeUntil(
            this.forceCancelSubject.pipe(
              filter((incomingId) => {
                return incomingId === atom.getId();
              }),
            ),
          ),
          map((response) => {
            this._instance.updateNode(atom.getId(), { result: response });
            return response;
          }),
          catchError((err) => {
            this._instance.updateNode(atom.getId(), { error: err });
            throw err;
          }),
          share(),
        );
      },
    };
  }
}
