import { WordCard } from "./WordCard";
import { WordsCollection } from "../../domain/user/WordDescriptor";
import { Group, Flex, Loader, Text } from "@mantine/core";
import { UsersAtom } from "../../domain/user/UserModel";
import { useAtom } from "@espoojs/atom";
import { useCurrentMywords } from "../../domain/user/useCurrentMywords";

export const ExtractedWordsView = ({
  words = {},
  loading,
  contentUrl
}: {
  words?: WordsCollection;
  loading?: boolean;
  contentUrl: string;
}) => {
  const [, setUserContent] = useAtom(UsersAtom, { noStateUpdate: true });
  const { mywords } = useCurrentMywords(contentUrl);

  return (
    <>
      <Group justify="space-between" mb={"sm"}>
        {loading ? <Loader type="dots"></Loader> : <div />}{" "}
        <Text size="sm">{Object.keys(words)?.length} Words</Text>
      </Group>
      <Flex direction={"row"} wrap={"wrap"}>
        {Object.entries(words)?.map(([word, descriptor]) => {
          return (
            <WordCard
              key={word}
              isSaved={mywords[word] !== undefined}
              onMenuClick={(action) => {
                if (action === "save" && contentUrl) {
                  setUserContent((state) => {
                    // const myWords = new Map(state.myWords);
                    // myWords.set(word, item[word]);
                    return {
                      myWords: {
                        [contentUrl]: {
                          ...(state.myWords?.[contentUrl] || {}),
                          [word]: descriptor,
                        },
                      },
                    };
                  });
                }
              }}
              descriptor={descriptor}
              word={word}
            />
          );
        }) || []}
      </Flex>
    </>
  );
};
