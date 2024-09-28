import { WordCard } from "./WordCard";
import { WordsDict } from "../../domain/user/WordDescriptor";
import { Group, Flex, Loader, Text } from "@mantine/core";
import { UsersAtom } from "../../domain/user/SettingsModel";
import { useAtom } from "@espoojs/atom";

export const ExtractedWordsView = ({
  words,
  loading,
}: {
  words?: string;
  loading?: boolean;
}) => {
  const jsonResult: WordsDict[] | undefined = words
    ?.split("\n")
    .map((line) => {
      // |word|translation|kind|examples|
      const [word, translation, kind, ...examples] = line.trim().split("|");
      const getExamples = (example: string) => {
        const [lang, translation] = example.split("#");
        return { [lang]: translation };
      };

      const examplesCollection = examples.map(getExamples);
      return {
        [word]: { translation, kind, examples: examplesCollection },
      } as WordsDict;
    })
    .filter(Boolean);

  const [, setUserState] = useAtom(UsersAtom, {noStateUpdate: true});

  return (
    <>
      <Group justify="space-between" mb={"sm"}>
        {loading ? <Loader type="dots"></Loader> : <div />}{" "}
        <Text size="sm">{jsonResult?.length} Words</Text>
      </Group>
      <Flex direction={"row"} wrap={"wrap"}>
        {jsonResult?.map((item) => {
          const word = Object.keys(item)[0];
          return (
            <WordCard
              key={word}
              onMenuClick={(action) => {
                if (action === "save") {
                  console.log("save", item[word]);
                  setUserState((state) => {
                    // const myWords = new Map(state.myWords);
                    // myWords.set(word, item[word]);
                    return {
                      myWords: {
                        ...state.myWords,
                        [word]: item[word],
                      },
                    };
                  });
                }
              }}
              descriptor={item[word]}
              word={word}
            ></WordCard>
          );
        }) || []}
      </Flex>
    </>
  );
};
