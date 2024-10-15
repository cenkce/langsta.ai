import { useAtom } from "@espoojs/atom";
import FlashCardQueue from "./FlashCardQueue";
import { UsersAtom } from "../../domain/user/UserModel";
import { FlashCardData } from "./FlashCardData";
import { useUserContentState } from "../../domain/content/ContentContext.atom";
import { useMemo } from "react";
import { useCurrentMywords } from "../../domain/user/useCurrentMywords";

export const FlashCardsView = () => {
  const [, setUserContent] = useAtom(UsersAtom);
  const { activeTabUrl = "" } = useUserContentState();
  console.log("activeTabUrl", activeTabUrl);
  const { mywords, learnedWords } = useCurrentMywords();

  const cards = useMemo(
    () =>
      Object.entries(mywords)
        .filter(([word]) => !learnedWords?.some((l) => l === word))
        .map(([word, descriptor]) => {
          return {
            descriptor,
            image: "",
            word: word || '',
            isLearned: learnedWords?.some((l) => l === word),
          } as FlashCardData;
        }),
    [],
  );

  return (
    <FlashCardQueue
      data={cards}
      onAction={(action, index) => {
        if (activeTabUrl && action === "learned")
          setUserContent({
            learnedWords: {
              [activeTabUrl]: [...learnedWords, cards[index].word],
            },
          });
      }}
      learnedWords={learnedWords}
    />
  );
};
