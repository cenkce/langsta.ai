import { of, timeout } from "rxjs";
import { Task, TaskStore } from "./TaskStore";
import { expect, test } from "vitest";

test("should create task and get its result using id", () => {
  return new Promise<void>((res) => {
    const task = () => {
      return of(1);
    };
    const { id, chargeAtom$, plugAtom$ } = TaskStore.createTaskAtom(task);
    const stream$ = chargeAtom$();

    TaskStore.instance.subscribeTaskById(id).subscribe((task) => {
      if (task?.status === "completed") {
        expect(task.result).toBe(1);
        res();
      }
    });
    plugAtom$(stream$).subscribe((value) => {
      expect(value).toBe(1);
    });
  });
});

test("should create task and get its result using tag", () => {
  return new Promise<void>((res) => {
    const tag = "test-atom";
    const task: Task<number> = ({ tags }) => {
      expect(tags[0]).toBe(tag);
      return of(1);
    };
    const { chargeAtom$, plugAtom$, id } = TaskStore.createTaskAtom(task, {
      tags: [tag],
    });
    const stream$ = chargeAtom$();

    const statuses: string[] = []

    TaskStore.instance
      .subscribeTaskByTagName(tag, ["completed", "idle", 'progress'])
      .pipe(timeout(10))
      .subscribe((task) => {
        if(task)
          statuses.push(task?.status)
        if (task?.status === "completed") {
          expect(task.id).toBe(id);
          expect(task.result).toBe(1);
          expect(statuses).toStrictEqual(["idle", "progress", "progress", "completed"]);
          res();
        }
      });
    plugAtom$(stream$).subscribe((value) => {
      expect(value).toBe(1);
    });
  });
});
