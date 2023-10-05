import { PropsWithChildren, useEffect } from "react";
import { useAtom } from "../../core/useAtom";
import { ContentStorage } from "../content/ContentStorage";
import { Atom } from "../../core/StoreSubject";

export function LocalstorageSyncProvider (
  props: PropsWithChildren<{
    debugKey?: string;
    storageAtom: Atom<Record<string, any>>;
    contentStorage: ContentStorage;
  }>
) {
  const [storageValue, setStorageData] = useAtom(props.storageAtom);
  const contentStorage = props.contentStorage;

  console.log("storageValue : ", storageValue);

  useEffect(() => {
    contentStorage
      .getState()
      .then((data) => {
        console.log("initial data : ", props.debugKey, data);
        data && setStorageData(data);
      })
      .catch(console.error);
      
    return contentStorage.subscribe((changes) => {
      Object.entries(changes).forEach(([key, { newValue, oldValue }]) => {
        console.debug(props.debugKey, "contentStorage subsbription", key, newValue);
        if (newValue !== oldValue) setStorageData({ [key]: newValue });
      });
    });
  }, []);

  return <>{props.children}</>;
}
