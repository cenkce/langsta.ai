import { useAtom } from "@espoojs/atom";
import { UsersAtom } from "../../domain/user/UserModel";
import { useMemo } from "react";
import Crosswords from "./Crosswords";

export interface WordEntry {
  id?: number;
  answer: string;
  clue: string;
}

export const CrosswordsView = ({contentUrl}: { contentUrl: string }) => {
  const [state] = useAtom(UsersAtom);
  const data = useMemo<WordEntry[]>(() => {
    return Object.entries(state.myWords?.[contentUrl] || {}).map(([word, item]) => {
      return {
        answer: word,
        clue: item.translation,
      }
    })
  }, [contentUrl])

  return (
    <Crosswords words={data} />
  );
}

