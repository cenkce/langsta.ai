import { take } from "rxjs";
import { Atom, StoreSubject } from "./StoreSubject";
import { describe, expect, it } from "vitest";

describe("StoreSubject", () => {
  it("should create a new Atom and set or get new values", async () => {
    const store = new StoreSubject({
      "atom-name": { state: "state-value", state2: 1 },
      "another-state": { state: "state-value" },
    });
    return new Promise<void>((res) => {
      const atom = Atom.of(
        { key: "atom-name" },
        store,
      );
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
    return new Promise<void>((done) => {
      const store = new StoreSubject<{"state-name": number }>({ "state-name": 0 });
      const atom = Atom.of({ key: "state-name" }, store);
      const stream$ = atom.get$();
      const values: number[] = []
      const subscription = stream$.pipe(take(1)).subscribe({
        next(value){
            values.push(value)
            if (value === 1) {
              subscription.unsubscribe();
            }
          },
          complete: () => {
            expect(values).toBe([0, 1]);
            done();
          }
      });
  
      atom.set$(1);
    });
  });
});
