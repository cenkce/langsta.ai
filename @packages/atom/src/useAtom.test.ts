import { renderHook, act } from "@testing-library/react";
import { useAtom } from "./useAtom";
import { Atom, StoreSubject } from "./StoreSubject";
import { expect, test } from "vitest";
/**
 * @vitest-environment jsdom
 */
test("should set state of Atom", async () => {
  const MockAtom = Atom.of(
    { key: "mockAtom" },
    new StoreSubject({ mockAtom: { state: 1 } }),
  );
  
  const n = MockAtom.get$("state");
  n.subscribe((v) => { v })

  const { result } = renderHook(() => useAtom(MockAtom));
  act(() => {
    result.current[1]({ state: 2 });
  });

  expect(result.current[0].state).toBe(2);
});

test("should set state of Atom using callback", async () => {
  const MockAtom = Atom.of(
    { key: "mockAtom" },
    new StoreSubject({ mockAtom: { state: 1 } }),
  );

  const { result } = renderHook(() => useAtom(MockAtom));

  act(() => {
    result.current[1]((state: { state: number }) => ({
      state: 2 + state.state,
    }));
  });

  expect(result.current[0].state).toBe(3);
});
