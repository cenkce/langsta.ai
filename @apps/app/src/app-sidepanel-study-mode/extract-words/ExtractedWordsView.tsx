import { Group, Loader, Flex, Text } from "@mantine/core";
import { type WordCollection, WordCard } from "./WordCard";

export const ExtractedWordsView = ({ words, loading }: { words?: string; loading?: boolean; }) => {
  let jsonResult: WordCollection[] | undefined;
  try {
    jsonResult = JSON.parse(
      words?.substring(0, words?.lastIndexOf("},") + 1) + "]"
    );
  } catch {
    console.error(
      "Failed to parse words"
    );
    jsonResult = [];
  }

  return (
    <>
      <Group justify="space-between" mb={'sm'}>
        {loading ? <Loader type="dots"></Loader> : <div />}{" "}
        <Text size="sm">{jsonResult?.length} Words</Text>
      </Group>
      <Flex direction={"row"} wrap={"wrap"}>
        {jsonResult?.map((item) => {
          const word = Object.keys(item)[0];
          return <WordCard key={word} descriptor={item[word]} word={word}></WordCard>;
        }) || []}
      </Flex>
    </>
  );
};
