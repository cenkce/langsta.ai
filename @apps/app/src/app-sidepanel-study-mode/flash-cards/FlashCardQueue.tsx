import React, { useState } from "react";
import FlashCard, { FlashCardAction } from "./FlashCard";
import { FlashCardData } from "./FlashCardData";
import { Box, Title } from "@mantine/core";
import { FlexRow } from "../../ui/FlexRow";

type FlashCardQueueProps = {
  data: FlashCardData[];
  learnedWords?: string[];
  onAction?: (action: FlashCardAction, index: number) => void;
};

const FlashCardQueue: React.FC<FlashCardQueueProps> = ({ data, onAction }) => {
  // const unlearnedWords = data.filter((card) => !card.isLearned);
  const wordsToStudy = data
    .map((desc, i) => (desc.isLearned ? null : i))
    .filter((val) => val !== null) as number[];
  const learnedWords = data
    .map((desc, i) => (!desc.isLearned ? null : i))
    .filter((val) => val !== null) as number[];
  const [head, setHead] = useState(0);
  const [status, setStatus] = useState<"fading" | "idle">("idle");
  console.log("wordsQueue", head, wordsToStudy, learnedWords);

  const removeCard = (action: FlashCardAction, current: number) => {
    if (action !== "flip") {
      setStatus("fading");
      const index = wordsToStudy[current];
      onAction?.(action, index);
    }
  };
  const card = data[wordsToStudy[head]];

  return (
    <Box>
      <FlexRow>
        <Box>
          <Box>
            <Title order={6}>Words to study ({wordsToStudy.length})</Title>
          </Box>
          <Box style={{ position: "relative" }}>
            {card ? (
              <FlashCard
                width={500}
                height={400}
                examples={
                  card.descriptor
                    ? (card.descriptor.examples.map((example) => {
                        const langs = card.descriptor?.langs;
                        return langs ? langs.map((lang) => example[lang]) : [];
                      }) as [string, string][])
                    : []
                }
                word={card.word}
                translation={card.descriptor?.translation}
                kind={card.descriptor?.kind}
                key={head}
                onAction={(action) => {
                  removeCard(action, head);
                }}
                onFlipped={() => {
                  setStatus("idle");
                }}
                onFadeOutEnd={() => {
                  setHead((head) =>
                    head + 1 > wordsToStudy.length - 1 ? 0 : head + 1,
                  );
                  setStatus("idle");
                }}
                isFadingOut={status === "fading"}
              />
            ) : null}
          </Box>
        </Box>
        {/* <Box>
          <Title order={6}>Learned words {`${learnedWords.length} / ${queue.length}`} </Title>
          <Box
            style={{ position: "relative", height: "200px", width: "400px" }}
          >
            {learnedWords.map((card, index) => (
              <FlashCard
                examples={
                  card.descriptor
                    ? card.descriptor.examples.map((example) => {
                        const langs = card.descriptor?.langs;
                        return langs ? langs.map((lang) => example[lang]) : [];
                      })
                    : []
                }
                word={card.word}
                kind={card.descriptor?.kind}
                key={index}
                index={index}
                onAction={(action) => removeCard(action, index)}
                isFadingOut={index === fadingOutIndex}
              />
            ))}
          </Box>
        </Box> */}
      </FlexRow>
    </Box>
  );
};

export default FlashCardQueue;
