import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { LocalStorage } from "./LocalStorage";
import { Atom, useAtom } from "@espoojs/atom";
import { verbose } from "../utils/verbose";
import { Collection } from "./Collection";
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
  StorageT extends Collection = Collection,
>(
  props: PropsWithChildren<{
    debugKey?: string;
    storageAtom: Atom;
    contentStorage: LocalStorage<StorageT>;
    verbose?: boolean;
  }>,
) {
const log = useMemo(() => verbose(`useLocalstorageSync of ${props.debugKey}`), [props.debugKey]);

  const initializedRef = useRef(false);
  const [, setStorageData] = useAtom(props.storageAtom, {
    noStateUpdate: true,
  });
  const contentStorage = props.contentStorage;

  useEffect(() => {
    const unloads: (() => void)[] = [];
    log(props.verbose, "initialized atom subscription ")
    const subscription = props.storageAtom.get$().subscribe((storageValue) => {
      log(props.verbose, "atom : ", storageValue)
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
        log(props.verbose, "new changes passed : ", changes)

        if (props.contentStorage.name in changes) {
          Object.entries(changes).forEach(([, { newValue }]) => {
            log(props.verbose, "new update : ", newValue)
            setStorageData(newValue);
          });
        }
      }),
    );

    return () => {
      log(props.verbose, "unmounted ");
      unloads.forEach((unload) => unload?.());
    };
  }, []);
}
