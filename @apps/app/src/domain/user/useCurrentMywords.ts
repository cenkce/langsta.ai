import { useAtom } from "@espoojs/atom";
import { useMemo } from "react";
import { useUserContentState } from "../content/ContentContext.atom";
import { UsersAtom } from "./UserModel";

export const useCurrentMywords = (contentUrl?: string) => {
  const [state] = useAtom(UsersAtom);
  const { activeTabUrl = "" } = useUserContentState();
  const url = contentUrl || activeTabUrl;
  
  const mywords = useMemo(
    () => state.myWords?.[url] || {},
    [state.myWords?.[url]],
  );

  const learnedWords = useMemo(
    () => state.learnedWords?.[url] || [],
    [state.learnedWords?.[url]],
  );

  return {mywords, learnedWords};
};
