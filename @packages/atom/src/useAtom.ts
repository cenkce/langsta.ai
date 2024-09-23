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
  TName extends string | undefined,
  State extends TName extends string ? TState[TName] : TState,
  Names extends keyof State,
>(
  atom: Atom<TState, TName>,
  {
    subscribeKey,
    noStateUpdate = false,
    equalityCheck,
    ignoreUpdateKeys,
  }: {
    subscribeKey?: Names;

    /**
     * You should assign an equalityCheck function to ignore some keys.
     */
    ignoreUpdateKeys?: Names[];
    noStateUpdate?: boolean;
    equalityCheck?: (newState: State, state: State) => boolean;
  } = {},
) {
  const value = atom.getValue();
  const [state, setState] = useState(value);
  const stateRef = useRef(state);
  const equityCHeckRef = useRef(equalityCheck);
  equityCHeckRef.current = equalityCheck;
  stateRef.current = state;

  useEffect(() => {
    if (noStateUpdate === false) {
      const subscription = atom.get$(subscribeKey as string)?.subscribe({
        next(newState) {
          if (newState) {
            const state = { ...newState };
            if (ignoreUpdateKeys?.length && equityCHeckRef.current) {
              ignoreUpdateKeys.forEach((key) => {
                delete state[key];
              });
            }
            setState((curr: any) => {
              const update = equityCHeckRef.current
                ? equityCHeckRef.current?.(state as State, curr)
                  ? curr
                  : newState
                : newState;
              return update;
            });
          }
        },
        // error: console.error,
      });
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [atom, noStateUpdate]);

  const setNewState = useCallback(
    (
      newState:
        | ((
            state: TName extends string ? TState[TName] : TState,
          ) => TName extends string ? TState[TName] : TState)
        | (TName extends string ? TState[TName] : TState),
    ) => {
      const update =
        newState instanceof Function ? newState(atom.getValue()) : newState;
      atom.set$(update);
    },
    [atom],
  );

  return [state, setNewState] as const;
}

export { useAtom };
