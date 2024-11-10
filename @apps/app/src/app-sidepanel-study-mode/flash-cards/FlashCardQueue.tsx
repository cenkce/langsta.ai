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
  const unlearnedWords = data.filter((card) => !card.isLearned);
  const [queue, setQueue] = useState(unlearnedWords);
  const [fadingOutIndex, setFadingOutIndex] = useState<number | null>(null);

  const learnedWords = data.filter((card) => card.isLearned);

  const removeCard = (action: FlashCardAction, index: number) => {
    setFadingOutIndex(index);
    setTimeout(() => {
      setQueue(queue.filter((_, i) => i !== index));
      setFadingOutIndex(null);
    }, 1000); // 1 second fade-out duration
    onAction?.(action, index);
  };

  return (
    <Box>
      <FlexRow>
        <Box>
          <Box>
            <Title order={6}>
              Words to learn ({data.length - learnedWords.length})
            </Title>
          </Box>
          <Box
            style={{ position: "relative", height: "200px", width: "400px" }}
          >
            {queue.map((card, index) => (
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
        </Box>
        <Box>
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
        </Box>
      </FlexRow>
    </Box>
  );
};

export default FlashCardQueue;
