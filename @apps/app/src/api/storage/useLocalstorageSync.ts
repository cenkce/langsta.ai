import { PropsWithChildren, useEffect, useRef } from "react";
import { LocalStorage } from "./LocalStorage";
import { Atom, useAtom } from "@espoojs/atom";

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
    props.verbose && console.debug("initialize atom subscription : ", props.debugKey);
    const subscription = props.storageAtom.get$().subscribe((storageValue) => {
      props.verbose && console.debug("atom : ", props.debugKey, storageValue);
      if (initializedRef.current) {
        contentStorage.load(storageValue);
      }
    });

    unloads.push(() => subscription.unsubscribe());
    // loads initial storage value
    contentStorage
      .getState()
      .then((data) => {
        if (data) setStorageData(data);
        initializedRef.current = true;
      })
      .catch(console.error);

    // subscribes storage changes and updates its local state with
    unloads.push(
      contentStorage.subscribe((changes) => {
        props.verbose && console.debug("changes : ", props.debugKey, changes);

        if (props.contentStorage.name in changes) {
          Object.entries(changes).forEach(([, { newValue }]) => {
            props.verbose && console.debug("new update : ", newValue);
            setStorageData(newValue);
          });
        }
      }),
    );

    return () => {
      props.verbose && console.debug("unmounted : ", props.debugKey);
      unloads.forEach((unload) => unload?.());
    };
  }, []);
}
