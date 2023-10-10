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
import { StoreSubject } from "../core/StoreSubject";
import { nanoid } from "nanoid";

export type Task<
  R = unknown, //Response
  P extends Record<string, unknown> | undefined = undefined // Params
> = (params: TaskParams<P>) => Observable<R>;
export type DefaultTaskParams = {
  tags: string[];
  reserveTags?: boolean;
};
export type TaskParams<
  T extends Record<string, unknown> | undefined = undefined
> = T extends undefined ? DefaultTaskParams : DefaultTaskParams & T;
export type TaskNode<
  R = unknown,
  P extends Record<string, unknown> | undefined = undefined
> = {
  task: Task<R, P>;
  params?: TaskParams<P>;
  status: TaskStatus;
  error?: any;
  result?: any;
  id: string;
};
// const INITIAL_VALUE = Symbol("TASK_INITIAL_VALUE");

type TaskStatus = "completed" | "idle" | "progress" | "error";
const TaskStatuses = ["completed", "idle", "progress", "error"] as TaskStatus[];

type TasksSubject = StoreSubject<{
  tasks: Map<string, TaskNode<unknown, any>>;
  nodesByTag: Map<string, Set<string>>;
}>;
export type TaskNodeParams<
  R,
  P extends Record<string, unknown> | undefined = undefined
> = Omit<TaskNode<R, P>, "id">;
export class TaskAtom<
  R = unknown,
  P extends Record<string, unknown> | undefined = undefined
> {
  private id: string = nanoid();
  constructor(store: TasksSubject, private nodeParams: TaskNodeParams<R, P>) {
    const state = store.getValue();
    const nodes = new Map(state.tasks);
    const node = { ...this.nodeParams, id: this.id } as TaskNode<R, P>;
    nodes.set(this.id, node);

    const newTasks = new Map(store.getValue().tasks);
    newTasks.set(this.id, node);
    store.next({
      ...state,
      tasks: newTasks,
    });
  }

  getId() {
    return this.id;
  }

  getNode() {
    return { ...this.nodeParams };
  }
}

export class TaskStore extends StoreSubject<{
  tasks: Map<string, TaskNode<unknown, undefined>>;
  nodesByTag: Map<string, Set<string>>;
}> {
  private static _instance;
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

  updateNode(id: string, update: Partial<TaskNode<unknown, any>>) {
    const tasks = new Map(this.value.tasks);
    const currentNode = tasks.get(id);
    
    // shallow check
    if (
      Object.keys(update).some((key) => {
        return (
          currentNode &&
          Object.is((currentNode as Record<string, unknown>)[key], (update as Record<string, unknown>)[key])
        );
      })
    )
      return;

    const updateNode = { ...currentNode, ...update } as TaskNode;

    console.log(id, update)
    if (currentNode) tasks.set(id, updateNode);

    const nodesByTag = new Map(this.value.nodesByTag);
    currentNode?.params?.tags.forEach((tag) => {
      const tagMap = new Set(nodesByTag.get(tag));
      TaskStatuses.forEach((status) => tagMap.delete(`${status}_${id}`));
      tagMap.add(`${updateNode.status}_${id}`);
      nodesByTag.set(tag, tagMap);
    });

    this.next({ tasks, nodesByTag });
  }

  static cancelTask(id: string) {
    this.forceCancelSubject.next(id);
  }

  subscribeTaskById(id: string) {
    return this.pipe(map(({ tasks }) => tasks.get(id), distinctUntilChanged()));
  }

  subscribeTaskByTagName(
    tag: string,
    statuses: TaskStatus[] = ["idle", "progress"]
  ) {
    return this.pipe(
      map(
        ({ tasks, nodesByTag }) => {
          const statusHashes = nodesByTag.get(tag);
          const selectedTasks: string[] = [];

          statusHashes?.forEach((hash) => {
            if (statuses.some((status) => hash.indexOf(status) === 0)) {
              const taskId = hash.substring(hash.indexOf("_") + 1); // parse taskid
              selectedTasks.push(taskId);
            }
          });

          return selectedTasks.map((taskId) => tasks.get(taskId));
        },
        distinctUntilChanged<TaskNode<unknown, any>[]>((prev, current) => {
          return current.some((taskNode, i) => Object.is(taskNode, prev[i]));
        })
      )
    );
  }

  static createTaskAtom<
    R = unknown,
    P extends Record<string, unknown> | undefined = undefined
  >(task: Task<R, P>, params?: TaskParams<P>) {
    const atom = new TaskAtom<R, P>(TaskStore._instance, {
      task,
      params,
      status: "idle",
    });

    const node = atom.getNode();
    return {
      id: atom.getId(),
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
          catchError((err, caught) => {
            this._instance.updateNode(atom.getId(), { error: err });
            return caught;
          }),
          takeUntil(
            this.forceCancelSubject.pipe(
              filter((incomingId) => {
                return incomingId === atom.getId();
              })
            )
          ),
          map((response) => {
            this._instance.updateNode(atom.getId(), { result: response });
            return response;
          }),
          share()
        );
      },
    };
  }
}
