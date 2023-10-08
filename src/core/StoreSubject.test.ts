import { take } from "rxjs";
import { Atom, StoreSubject } from "./StoreSubject";
import { expect, test } from "vitest";

test("should create a new Atom and set or get new values", () => {
  const store = new StoreSubject<{
    ["state-name"]: { state: string; state2: number } | undefined;
  }>({
    "state-name": { state: "state-value", state2: 1 },
  });
  return new Promise<void>((res) => {
    const atom = Atom.of({ key: "state-name" }, store);
    atom.get$("state").pipe(take(1)).subscribe((value) => {
      expect(value).toBe("state-value");
    });

    atom.set$({ state: "new-state-value" });
    atom.get$("state").pipe(take(1)).subscribe((value) => {
      expect(value).toBe("new-state-value");
    });

    const values: any[] = [];

    const subscription2 = atom.get$("state2").subscribe((value) => {
      values.push(value);
      if (typeof value === "string") throw new Error();
      else if (typeof value === "number") {
        if (value === 2) {
          expect(values).toEqual([1, 2]);
          subscription2.unsubscribe();
          res();
        } else {
          expect(value).toBe(1);
        }
      } else {
        throw new Error();
      }
    });

    atom.set$({ state: "new-state-value", state2: 2 });
  });
});

test("should create a new primitive Atom and set or get new values", () => {
  return new Promise<void>((done) => {
    const store = new StoreSubject({
      "state-name": 0,
    });
    const atom = Atom.of({ key: "state-name" }, store);
    const values: number[] = [];
    const stream$ = atom.get$();
    const subscription = stream$.subscribe((value: any) => {
      expect(value).toBe([0, 1][value]);
      values.push(value);
      if (value === 1) {
        expect(values).toEqual([0, 1]);
        subscription.unsubscribe();
        done();
      }
    });

    atom.set$(1);
  });
});
