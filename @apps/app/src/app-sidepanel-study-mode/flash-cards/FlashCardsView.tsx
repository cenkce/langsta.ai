import { useAtom } from "@espoojs/atom";
import { UsersAtom } from "../../domain/user/UserModel";
// import FlashCardQueue from "../../ui/flashcardslist/FlashCardQueue";
import Crosswords, { WordEntry } from "../../ui/crosswords/Crosswords";
import { useMemo } from "react";

export const FlashCardsView = () => {
  const [state] = useAtom(UsersAtom);
  const data = useMemo<WordEntry[]>(() => {
    return Object.entries(state.myWords).map(([word, item]) => {
      return {
        answer: word,
        clue: item.translation,
      }
    })
  }, [])
  return (
    <Crosswords words={data} />
  );
}

