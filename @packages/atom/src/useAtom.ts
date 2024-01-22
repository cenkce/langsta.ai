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
  {
    subscribeKey,
    noStateUpdate = false,
    equalityCheck,
    ignoreUpdateKeys
  }: {
    subscribeKey?: TState[TName] extends { [key: string]: any }
      ? keyof TState[TName]
      : undefined;
    /**
     * You should assign an equalityCheck function to ignore some keys.
     */
    ignoreUpdateKeys?: TState[TName] extends { [key: string]: any }
      ? (keyof TState[TName])[]
      : undefined;
    noStateUpdate?: boolean;
    equalityCheck?: (newState: TState[TName], state: TState[TName]) => boolean;
  } = {},
) {
  const value = atom.getValue() as TState[TName];
  const [state, setState] = useState<TState[TName]>(value);
  const stateRef = useRef<TState[TName]>(state);
  const equityCHeckRef = useRef(equalityCheck);
  equityCHeckRef.current = equalityCheck;
  stateRef.current = state;

  useEffect(() => {
    if (noStateUpdate === false) {
      const subscription = atom.get$(subscribeKey).subscribe({
        next(newState) {
          if (typeof newState === "object") {
            const state = {...newState};
            if(ignoreUpdateKeys?.length && equityCHeckRef.current) {
              ignoreUpdateKeys.forEach(key => {
                delete state[key];
              });
            }
            setState((curr) => {
              const update = equityCHeckRef.current
                ? equityCHeckRef.current?.(state, curr)
                  ? curr
                  : newState
                : newState;
              return update;
            });
          }
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
