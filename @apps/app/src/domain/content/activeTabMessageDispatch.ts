import { useEffect, useRef, useState } from "react";
import { TabMessages } from "./TabMessages";
import { PageContent } from "./ContentContext.atom";

export const useCurrentTabData = () => {
  const [tab, setTab] = useState<chrome.tabs.Tab | undefined>();
  const tabRef = useRef(tab);
  tabRef.current = tab;

  useEffect(() => {
    const queryOptions = { active: true, currentWindow: true };
    chrome.tabs.query(queryOptions).then((tabs) => setTab(tabs[0]));
  }, []);

  return tabRef;
};

export const activeTabMessageDispatch = async (message: TabMessages) => {
  const queryOptions = { active: true, currentWindow: true };
  const tabs = await chrome.tabs.query(queryOptions);

  return new Promise<{url: string, content: PageContent}>((resolve, reject) => {
    if (tabs?.[0]?.id)
      chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
        resolve(response);
      });
    else reject("No active tab found");
  });
};
