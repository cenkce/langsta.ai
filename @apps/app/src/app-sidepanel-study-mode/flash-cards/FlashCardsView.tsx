import { useAtom } from "@espoojs/atom";
import FlashCardQueue from "./FlashCardQueue";
import { UsersAtom } from "../../domain/user/UserModel";
import { FlashCardData } from "./FlashCardData";
import { useMemo } from "react";
import { useCurrentMywords } from "../../domain/user/useCurrentMywords";

export const FlashCardsView = ({ contentUrl }: { contentUrl: string }) => {
  const [, setUserContent] = useAtom(UsersAtom);
  const { mywords, learnedWords } = useCurrentMywords(contentUrl);

  const cards = useMemo(
    () =>
      Object.entries(mywords).map(([word, descriptor]) => {
        return {
          descriptor,
          image: "",
          word: word || "",
          isLearned: learnedWords?.some((l) => l === word),
        } as FlashCardData;
      }),
    [mywords, learnedWords],
  );

  return (
    <FlashCardQueue
      data={cards}
      onAction={(action, index) => {
        if (contentUrl && action === "learned") {
          setUserContent({
            learnedWords: {
              [contentUrl]: [...learnedWords, cards[index].word],
            },
          });
        }
      }}
      learnedWords={learnedWords}
    />
  );
};
