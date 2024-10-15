import { useAtom } from "@espoojs/atom";
import { UsersAtom } from "../../domain/user/UserModel";
// import FlashCardQueue from "../../ui/flashcardslist/FlashCardQueue";
import { useMemo } from "react";
import Crosswords from "./Crosswords";
import { useUserContentState } from "../../domain/content/ContentContext.atom";

export interface WordEntry {
  id?: number;
  answer: string;
  clue: string;
}

export const CrosswordsView = () => {
  const [state] = useAtom(UsersAtom);
  const { activeTabUrl = "" } = useUserContentState();
  const data = useMemo<WordEntry[]>(() => {
    return Object.entries(state.myWords?.[activeTabUrl] || {}).map(([word, item]) => {
      return {
        answer: word,
        clue: item.translation,
      }
    })
  }, [])

  console.log(data);
  return (
    <Crosswords words={data} />
  );
}

