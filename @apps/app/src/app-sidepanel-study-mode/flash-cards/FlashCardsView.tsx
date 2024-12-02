import { useAtom } from "@espoojs/atom";
import FlashCardsDeck from "./FlashCardsDeck";
import { UsersAtom } from "../../domain/user/UserModel";
import { FlashCardData } from "./FlashCardData";
import { useMemo } from "react";
import { useCurrentMywords } from "../../domain/user/useCurrentMywords";
import { TabContainer } from "../../ui/TabContainer";

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
    <TabContainer
      orientation="horizontal"
      tabs={[
        {
          button: "Words to Study",
          component: FlashCardsDeck,
          id: "Words to Study",
          title: `Words to Study (${cards.length - learnedWords?.length || 0})`,
          props: {
            actions: ["learned", "learn-later"],
            data: cards.filter((card) => !card.isLearned),
            onAction: (action, word) => {
              if (contentUrl && action === "learned") {
                setUserContent((state) => ({
                  ...state,
                  learnedWords: {
                    ...state.learnedWords,
                    [contentUrl]: [
                      ...(state.learnedWords?.[contentUrl] || []),
                      word,
                    ],
                  },
                }));
              }
            },
          },
        },
        {
          button: "Learned Words",
          component: FlashCardsDeck,
          id: "Learned Words",
          title: `Learned Words (${learnedWords?.length || 0})`,
          props: {
            actions: ["delete"],
            data: cards.filter((card) => card.isLearned),
            onAction: (action, word) => {
              if (contentUrl && action === "delete") {
                setUserContent((state) => ({
                  learnedWords: {
                    ...state.learnedWords,
                    [contentUrl]:
                      state.learnedWords?.[contentUrl].filter(
                        (data) => data !== word,
                      ) || [],
                  },
                }));
              }
            },
          },
        },
      ]}
    />
  );
};
