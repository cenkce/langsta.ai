import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Atom } from "./StoreSubject";

function useStore<T extends Record<string, any> = any>(
  atom: Atom<T>,
  noStateUpdate?: false | undefined,
  equityCHeck?: (newState: T, state: T) => boolean
): [T, Dispatch<SetStateAction<T>>];
function useStore<T extends Record<string, any> = any>(
  atom: Atom<T>,
  noStateUpdate: true,
  equityCHeck?: (newState: T, state: T) => boolean
): Dispatch<SetStateAction<T>>;
function useStore<T extends Record<string, any> = any>(
  atom: Atom<T>,
  noStateUpdate: boolean = false,
  equityCHeck?: (newState: T, state: T) => boolean
) {
  const [state, setState] = useState<T>(atom.getValue());
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (noStateUpdate === false) {
      const subscription = atom.get$().subscribe({
        next(newState) {
          setState((curr) =>
            equityCHeck ? (equityCHeck(newState, curr) ? curr : newState) : curr
          );
        },
        error: console.error,
      });
      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [atom]);

  useEffect(() => {
    atom.set$(state);
  }, [state]);

  const setNewState = useCallback((newState: ((state: T) => T) | T) => {
    const update = newState instanceof Function ? newState(state) : newState
    atom.set$( update );
  }, []);
  return noStateUpdate === true ? setNewState : ([state, setNewState] as const);
}

export { useStore as useAtom };
