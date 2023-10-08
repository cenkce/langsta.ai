import { of } from "rxjs";
import { TaskStore } from "./TaskStore";
import { expect, test } from 'vitest'


test('should create task and get its result', () => {
  const task = () => of(1);
  const { chargeAtom$, plugAtom$ } = TaskStore.createAtom(task);
  const stream$ = chargeAtom$();
  plugAtom$(stream$).subscribe((value) => {
    expect(value).toBe(1);
  });
});
