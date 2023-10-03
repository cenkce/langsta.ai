import { Atom, StoreSubject } from "./StoreSubject";

beforeAll(() => {
  console.log(" testing ");
});

test("should create a new Atom and set or get new values", (done) => {
  const store = new StoreSubject<{
    ["state-name"]?: { state: string; state2: number };
  }>({
    "state-name": { state: "state-value", state2: 1 },
  });
  const atom = Atom.of({ key: "state-name" }, store);
  const subscription = atom.get$("state").subscribe((value) => {
    expect(value).toBe("state-value");
    subscription.unsubscribe();
  });

  atom.set$({ state: "new-state-value" });
  atom.get$("state").subscribe((value) => {
    expect(value).toBe("new-state-value");
  });

  const values: any[] = [];

  const subscription2 = atom.get$("state2").subscribe((value) => {
    values.push(value);
    if (typeof value === "string") throw new Error();
    else if (typeof value === "number") {
      if (value === 2) {
        expect(values).toEqual([1,2]);
        subscription2.unsubscribe();
        done();
      } else {
        expect(value).toBe(1);
      }
    } else {
      throw new Error();
    }
  });

  atom.set$({ state: "new-state-value", state2: 2 });
});

test("should create a new primitive Atom and set or get new values", (done) => {
  const store = new StoreSubject({
    "state-name": 0,
  });
  const atom = Atom.of({ key: "state-name" }, store);
  const values: number[] = []
  const subscription = atom.get$().subscribe((value) => {
    expect(value).toBe([0, 1][value]);
    values.push(value);
    subscription.unsubscribe();

    if (value === 1) {
      expect(values).toEqual([0,1]);
      done();
    }
  });

  atom.set$(1);
});
