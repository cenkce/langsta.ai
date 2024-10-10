import { useAtom } from "@espoojs/atom";
import FlashCardQueue from "./FlashCardQueue";
import { UsersAtom } from "../../domain/user/UserModel";
import { FlashCardData } from "./FlashCardData";
import { useUserContentState } from "../../domain/content/ContentContext.atom";
import { useMemo } from "react";

export const FlashCardsView = () => {
  const [state] = useAtom(UsersAtom);
  const { activeTabUrl } = useUserContentState();
  const learnedWords = state?.learnedWords[activeTabUrl || ""];
    
  const cards = useMemo(
    () =>
      Object.entries(state.myWords).filter(([word]) => !learnedWords.some(l => l === word)).map(([word, item]) => {
        return {
          description: "",
          image: "",
          word: word,
          examples: [],
          translation: item.translation,
        } as FlashCardData;
      }),
    [],
  );

  return (
    <FlashCardQueue
      data={cards}
      onAction={(action, index) => {
        if (activeTabUrl && action === "learned")
          UsersAtom.set$({
            learnedWords: {
              [activeTabUrl]: [...learnedWords, cards[index].word],
            },
          });
      }}
      learnedWords={learnedWords}
    />
  );
};
