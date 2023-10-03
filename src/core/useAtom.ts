import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { StoreSubject } from "./StoreSubject";

function useStore<T = any>(
  atom: StoreSubject<T>,
  noStateUpdate?: false | undefined,
  equityCHeck?: (newState: T, state: T) => boolean
): [T, Dispatch<SetStateAction<T>>];
function useStore<T = unknown>(
  atom: StoreSubject<T>,
  noStateUpdate: true,
  equityCHeck?: (newState: T, state: T) => boolean
): Dispatch<SetStateAction<T>>;
function useStore<T = unknown>(
  atom: StoreSubject<T>,
  noStateUpdate: boolean = false,
  equityCHeck?: (newState: T, state: T) => boolean
) {
  const [state, setState] = useState<T>(atom.value);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (noStateUpdate === false) {
      const subscription = atom.subscribe({
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
    atom.next(state);
  }, [state]);

  const setNewState = useCallback((newState: ((state: T) => T) | T) => {
    const update = newState instanceof Function ? newState(state) : newState
    atom.next( update );
  }, []);
  return noStateUpdate === true ? setNewState : ([state, setNewState] as const);
}

export const createStore = <T = any>(initialData: T) => {
  return new StoreSubject<T>(initialData);
};

export { useStore as useAtom };
