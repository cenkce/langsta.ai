import { useAtom } from "@espoojs/atom";
import { useMemo } from "react";
import { useUserContentState } from "../content/ContentContext.atom";
import { UsersAtom } from "./UserModel";

export const useCurrentMywords = () => {
  const [state] = useAtom(UsersAtom);
  const { activeTabUrl = "" } = useUserContentState();
  const mywords = useMemo(
    () => state.myWords?.[activeTabUrl] || {},
    [state.myWords?.[activeTabUrl]],
  );

  const learnedWords = useMemo(
    () => state.learnedWords?.[activeTabUrl] || [],
    [state.learnedWords?.[activeTabUrl]],
  );

  return {mywords, learnedWords};
};
