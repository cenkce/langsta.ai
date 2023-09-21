import { PropsWithChildren } from "react";
import { RecoilSync } from "recoil-sync";
import { ExtensionLocalStorageInstace } from "./Storage";
import { DefaultValue } from "recoil";
import { useUserContentValue } from "../content/ContentContext.atom";

export function LocalstorageSync(props: PropsWithChildren) {
  console.log(useUserContentValue());
  return (
    <RecoilSync
      storeKey="content-store"
      read={(key) => {
        console.log('read')
        return ExtensionLocalStorageInstace.read(key).then(res => res || new DefaultValue());
      }}
      listen={({ updateItem }) => {
        console.log('listen')
        return ExtensionLocalStorageInstace.subscribe((changes) => {
          Object.entries(changes).forEach(([key, { newValue, oldValue }]) => {
            if(newValue !== oldValue)
              updateItem(key, newValue);
          });
        });
      }}
      write={({ diff }) => {
        console.log('write')
        for (const [key, value] of diff) {
          ExtensionLocalStorageInstace.write(key, value);
        }
      }}
    >
      {props.children}
    </RecoilSync>
  );
}
