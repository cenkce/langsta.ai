import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Atom } from "./StoreSubject";

function useAtom<T = any>(
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
  equityCHeck?: (newState: T, state: T) => boolean
) {
  const [state, setState] = useState<T>(atom.getValue());
  const stateRef = useRef(state);
  const equityCHeckRef = useRef(equityCHeck);
  equityCHeckRef.current = equityCHeck
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
    const update = newState instanceof Function ? newState(atom.getValue()) : newState;
    atom.set$(update);
  }, [atom]);

  return noStateUpdate === true ? setNewState : ([state, setNewState] as const);
}

export { useAtom };
