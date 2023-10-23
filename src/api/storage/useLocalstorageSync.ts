import { PropsWithChildren, useEffect, useRef } from "react";
import { useAtom } from "../core/useAtom";
import { LocalStorage } from "./LocalStorage";
import { Atom } from "../core/StoreSubject";

export function useLocalstorageSync<StorageT extends Record<string, unknown> = Record<string, unknown>>(
  props: PropsWithChildren<{
    debugKey?: string;
    storageAtom: Atom<Record<string, unknown>>;
    contentStorage: LocalStorage<StorageT>;
  }>
) {
  const initializedRef = useRef(false);
  const [storageValue, setStorageData] = useAtom(props.storageAtom);
  const contentStorage = props.contentStorage;

  // if(props.debugKey === 'settings')
  console.log(props.debugKey, storageValue);

  useEffect(() => {
    if (initializedRef.current && storageValue) contentStorage.load(storageValue as StorageT);
  }, [contentStorage, storageValue]);

  useEffect(() => {
    // loads initial storage value
    contentStorage
      .getState()
      .then((data) => {
        initializedRef.current = true;
        data && setStorageData(data);
      })
      .catch(console.error);

    // subscribes storage changes and updates its local state with
    return contentStorage.subscribe((changes) => {
      if(props.contentStorage.name in changes) {
        Object.entries(changes).forEach(([, { newValue, oldValue }]) => {
          if (newValue !== oldValue) setStorageData(newValue);
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
