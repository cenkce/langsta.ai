import { useAtom } from "@espoojs/atom";
import { UsersAtom } from "../../domain/user/UserModel";
// import FlashCardQueue from "../../ui/flashcardslist/FlashCardQueue";
import { useMemo } from "react";
import Crosswords from "./Crosswords";

export interface WordEntry {
  id?: number;
  answer: string;
  clue: string;
}

export const CrosswordsView = () => {
  const [state] = useAtom(UsersAtom);
  const data = useMemo<WordEntry[]>(() => {
    return Object.entries(state.myWords).map(([word, item]) => {
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

