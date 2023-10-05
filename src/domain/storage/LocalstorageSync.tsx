import { PropsWithChildren, useEffect, useRef } from "react";
import { useAtom } from "../../core/useAtom";
import { ContentStorage } from "../content/ContentStorage";
import { Atom } from "../../core/StoreSubject";

export function LocalstorageSyncProvider(
  props: PropsWithChildren<{
    debugKey?: string;
    storageAtom: Atom<Record<string, unknown>>;
    contentStorage: ContentStorage;
  }>
) {
  const initializedRef = useRef(false);
  const [storageValue, setStorageData] = useAtom(props.storageAtom);
  const contentStorage = props.contentStorage;

  console.log(props.debugKey, "storageValue : ", storageValue);

  useEffect(() => {
    if (initializedRef.current) contentStorage.load(storageValue);
  }, [storageValue]);

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
      Object.entries(changes).forEach(([key, { newValue, oldValue }]) => {
        console.debug(
          props.debugKey,
          "contentStorage subsbription",
          key,
          newValue,
          changes
        );
        if (newValue !== oldValue) setStorageData(newValue);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{props.children}</>;
}
