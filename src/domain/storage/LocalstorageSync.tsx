import { PropsWithChildren, useEffect } from "react";
import { useAtom } from "../../core/useAtom";
import { BehaviorSubject } from "rxjs";
import { ContentStorage } from "../content/ContentStorage";

export function LocalstorageSyncProvider (
  props: PropsWithChildren<{
    debugKey?: string;
    storageAtom: BehaviorSubject<Record<string, any>>;
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

    props.storageAtom.subscribe((state) => {
      console.log("subscribe : ", props.debugKey, state);
      props.contentStorage.load(state as any);
    })
    
    return contentStorage.subscribe((changes) => {
      Object.entries(changes).forEach(([key, { newValue, oldValue }]) => {
        console.debug(props.debugKey, "contentStorage subsbription", key, newValue);
        if (newValue !== oldValue) setStorageData({ [key]: newValue });
      });
    });
  }, []);

  return <>{props.children}</>;
}
