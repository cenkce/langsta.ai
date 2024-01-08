import { useCallback, useEffect, useRef, useState } from "react";
import { Atom } from "./StoreSubject";

/**
 * A hook that allows you to listen an atom that can be changed anywhere.
 *
 * @returns [value, setValue]
 *
 * @example
 * var atom = Atom.of({key: "settings"}, new StoreSubject({settings: {}}));
 * const [value, setValue] = useAtom(atom);
 */
function useAtom<
  TState extends { [key: string]: any },
  TName extends string = string,
>(
  atom: Atom<TState, TName>,
  noStateUpdate: boolean = false,
  pipes?: (newState: TState[TName], state: TState[TName]) => boolean,
) {
  const value = atom.getValue() as TState[TName];
  const [state, setState] = useState<TState[TName]>(value);
  const stateRef = useRef<TState[TName]>(state);
  const equityCHeckRef = useRef(pipes);
  equityCHeckRef.current = pipes;
  stateRef.current = state;

  useEffect(() => {
    if (noStateUpdate === false) {
      const subscription = atom.get$().subscribe({
        next(newState) {
          if (typeof newState === "object")
            setState((curr) => {
              const update = equityCHeckRef.current
                ? equityCHeckRef.current?.(newState, curr)
                  ? curr
                  : newState
                : newState;
              return update;
            });
        },
        error: console.error,
      });
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [atom, noStateUpdate]);

  const setNewState = useCallback(
    (newState: ((state: TState[TName]) => TState[TName]) | TState[TName]) => {
      const update =
        newState instanceof Function
          ? newState(atom.getValue() as TState[TName])
          : newState;
      atom.set$(update);
    },
    [atom],
  );

  return [state, setNewState] as const;
}

export { useAtom };
