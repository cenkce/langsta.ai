import { PropsWithChildren, useEffect, useRef } from "react";
import { LocalStorage } from "./LocalStorage";
import { Atom, useAtom } from "@espoojs/atom";
import shallowEqual from "../utils/shallowEqual";

/**
 * Listen to localstorage changes and syncs with the given atom
 * 
 * @example
 * ```tsx
 * const storageAtom = Atom.of({ key: "storageAtom" }, { name: "storageAtom" });
 * const contentStorage = LocalStorage.of<StorageT>("storageAtom");
 * useLocalstorageSync({
 *   debugKey: "settings-sidepanel",
 *   storageAtom: SettingsAtom,
 *   contentStorage: SettingsStorage,
 * });
 * 
 * ```
 * @param props 
 */
export function useLocalstorageSync<
  StorageT extends Record<string, unknown> = Record<string, unknown>,
>(
  props: PropsWithChildren<{
    debugKey?: string;
    storageAtom: Atom;
    contentStorage: LocalStorage<StorageT>;
    verbose?: boolean;
  }>,
) {
  const initializedRef = useRef(false);
  const [, setStorageData] = useAtom(props.storageAtom, {
    noStateUpdate: true,
  });
  const contentStorage = props.contentStorage;

  useEffect(() => {
    const unloads: (() => void)[] = [];
    const subscription = props.storageAtom.get$().subscribe((storageValue) => {
      initializedRef.current && contentStorage.load(storageValue);
    });

    unloads.push(() => subscription.unsubscribe());
    // loads initial storage value
    contentStorage
      .getState()
      .then((data) => {
        initializedRef.current = true;
        data && setStorageData(data);
      })
      .catch(console.error);

    // subscribes storage changes and updates its local state with
    unloads.push(
      contentStorage.subscribe((changes) => {
        if (props.contentStorage.name in changes) {
          Object.entries(changes).forEach(([, { newValue, oldValue }]) => {
            if (shallowEqual(newValue, oldValue)) setStorageData(newValue);
          });
        }
      })
    );

    return () => {
      unloads.forEach((unload) => unload());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
