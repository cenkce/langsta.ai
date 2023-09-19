import { PropsWithChildren, useEffect, useState } from "react";
import { UserModel } from "./UserModel";
import { LocalStorage } from "../core/Storage";
import { ExtractTabContentMessage } from "../content/ContentCopyMessage";
import { UserContext } from "./UserContext";

export const UserProvider = (props: PropsWithChildren) => {
  const [model, setModel] = useState(new UserModel(new LocalStorage()));
  
  useEffect(() => {
    chrome.runtime.onMessage.addListener((mess: ExtractTabContentMessage) => {
      if(mess.type === "extract-tab-content"){
        const newmodel = new UserModel(new LocalStorage());
        newmodel.setLatestCopiedContent(mess.payload?.textContent || '');
  
        setModel(newmodel);
      }
    });
  }, []);

  return <UserContext.Provider value={model}>
    {props.children}
  </UserContext.Provider>;
};
