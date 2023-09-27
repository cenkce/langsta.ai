import { PropsWithChildren, useEffect, useMemo } from "react";
import { ContentStorage } from "../content/ContentStorage";
import { RecoilSync } from "recoil-sync";
import { DefaultValue, RecoilState, useRecoilState } from "recoil";
import ContentContextAtom from "../content/ContentContext.atom";

export function LocalstorageSyncProvider<
  T = any
>(
  props: PropsWithChildren<{ debugKey?: string; storageAtom: RecoilState<T> }>
) {
  const [, setStorageData] = useRecoilState(ContentContextAtom);
  const contentStorage = useMemo(() => {
    return new ContentStorage(props.storageAtom.key);
  }, []);

  useEffect(() => {
    contentStorage
      .getState()
      .then((data) => {
        console.log('initial data : ', data);
        data && setStorageData(data as any)
      })
      .catch(console.error);
  }, []);

  return (
    <RecoilSync
      storeKey="content-store"
      read={(key: any) => {
        return contentStorage
          .read(key)
          .then((res) => res || new DefaultValue());
      }}
      listen={({ updateItem }) => {
        return contentStorage.subscribe((changes) => {
          console.debug(props.debugKey, "listen", changes);
          Object.entries(changes).forEach(([key, { newValue, oldValue }]) => {
            if (newValue !== oldValue) updateItem(key, newValue);
          });
        });
      }}
      write={({ diff }: { diff: Map<any, any> }) => {
        console.debug(props.debugKey, "write", diff);
        for (const [key, value] of diff) {
          contentStorage.write(key, value);
        }
      }}
    >
      <>{props.children}</>
    </RecoilSync>
  );
}
