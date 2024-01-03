import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
function useAtom<T = unknown>(
  atom: Atom<T>,
  noStateUpdate?: false | undefined,
  equityCHeck?: (newState: T, state: T) => boolean
): [T, Dispatch<SetStateAction<T>>];
function useAtom<T = any>(
  atom: Atom<T>,
  noStateUpdate: true,
  equityCHeck?: (newState: T, state: T) => boolean
): Dispatch<SetStateAction<T>>;
function useAtom<T = any>(
  atom: Atom<T>,
  noStateUpdate: boolean = false,
  pipes?: (newState: T, state: T) => boolean
) {
  const value = atom.getValue() as T;
  const [state, setState] = useState<T>(value);
  const stateRef = useRef(state);
  const equityCHeckRef = useRef(pipes);
  equityCHeckRef.current = pipes
  stateRef.current = state;

  useEffect(() => {
    if (noStateUpdate === false) {
      const subscription = atom.get$().subscribe({
        next(newState) {
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

  const setNewState = useCallback((newState: ((state: T) => T) | T) => {
    const update = newState instanceof Function ? newState(atom.getValue() as T) : newState;
    atom.set$(update);
  }, [atom]);

  return noStateUpdate === true ? setNewState : ([state, setNewState] as const);
}

export { useAtom };
