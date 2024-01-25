import { take } from "rxjs";
import { Atom, StoreSubject } from "./StoreSubject";
import { describe, expect, it } from "vitest";

describe("StoreSubject", () => {
  it("should create a new Atom and set or get new values", async () => {
    const store = new StoreSubject({
      "atom-name": { state: "state-value", state2: 1 },
      "another-state": { state3: "state-value" },
    });
    return new Promise<void>((res) => {
      const atom = Atom.of({ key: "atom-name" }, store);
      atom
        .get$("state2")
        .pipe(take(1))
        .subscribe((value) => {
          expect(value).toBe(1);
        });

      atom.set$({ state: "new-state-value" });
      atom
        .get$("state")
        .pipe(take(1))
        .subscribe((value) => {
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

  it("should create a new primitive Atom and set or get new values", () => {
    const store = new StoreSubject<{ "state-name": number }>({
      "state-name": 1,
    });
    const atom = Atom.of({ key: "state-name" }, store);
    const stream$ = atom.get$();
    const values: number[] = [];
    stream$.pipe(take(2)).subscribe({
      next(value) {
        values.push(value);
      },
      complete: () => {},
    });

    atom.set$(2);
    expect(values).toEqual([1, 2]);
  });

  it("should use same store for different states in multiple atoms", () => {
    const store = new StoreSubject({
      "state-name": 1,
      "state-name2": { value: 0, value2: 0 },
      "state-name3": 1,
    });
    const atom1 = Atom.of({ key: "state-name" }, store);
    const atom2 = Atom.of({ key: "state-name2" }, store);
    const atom3 = Atom.of({ key: "state-name3" }, store);

    expect(atom1.getValue()).toEqual(1);
    atom1.set$(2);
    expect(store.getValue()).toEqual({
      "state-name": 2,
      "state-name2": { value: 0, value2: 0 },
      "state-name3": 1,
    });
    expect(atom1.getValue()).toEqual(2);
    expect(atom2.getValue()).toEqual({ value: 0, value2: 0 });
    expect(atom3.getValue()).toEqual(1);

    atom2.set$({ value: 1 });
    expect(store.getValue()).toEqual({
      "state-name": 2,
      "state-name2": { value: 1, value2: 0 },
      "state-name3": 1,
    });
    expect(atom2.getValue()).toEqual({ value: 1, value2: 0 });
    expect(atom3.getValue()).toEqual(1);

    atom3.set$(2);
    atom2.set$({ value2: 2 });
    expect(store.getValue()).toEqual({
      "state-name": 2,
      "state-name2": { value: 1, value2: 2 },
      "state-name3": 2,
    });
    expect(atom3.getValue()).toEqual(2);
  });
});
