import React, { useState } from "react";
import FlashCard, { FlashCardAction } from "./FlashCard";
import { FlashCardData } from "./FlashCardData";
import { ActionIcon, Box, Center, Title } from "@mantine/core";
import { ArrowLeft, ArrowRight } from "react-feather";

type FlashCardsDeckProps = {
  data: FlashCardData[];
  learnedWords?: string[];
  onAction?: (action: FlashCardAction, index: number) => void;
  shouldAddData?: (data: FlashCardData) => boolean;
  header?: string;
};

const FlashCardsDeck: React.FC<FlashCardsDeckProps> = ({
  data,
  onAction,
  shouldAddData,
  header,
}) => {
  const prev = () => {
    setHead((head) => (head - 1 < 0 ? words.length - 1 : head - 1));
  };

  const next = () => {
    setHead((head) => (head + 1 > words.length - 1 ? 0 : head + 1));
  };

  const words = shouldAddData
    ? data
        .map((desc, i) => (shouldAddData(desc) ? i : null))
        .filter((val) => val !== null)
    : data.map((_, i) => i);
  const [head, setHead] = useState(0);
  const [status, setStatus] = useState<"fading" | "idle">("idle");

  const removeCard = (action: FlashCardAction, current: number) => {
    if (action !== "flip") {
      setStatus("fading");
      const index = words[current];
      onAction?.(action, index);
    }
  };
  const card = data[words[head]];
  const width = 500;
  const height = 400;

  return (
    <Box>
      <Box>
        <Title order={6}>{header}</Title>
      </Box>
      <Center style={{ gap: 10 }}>
        <ActionIcon onClick={() => prev()} size="compact-xs">
          <ArrowLeft />
        </ActionIcon>{" "}
        {head + 1} / {words.length}
        <ActionIcon size="compact-xs" onClick={() => next()}>
          <ArrowRight />
        </ActionIcon>
      </Center>
      <Box style={{ position: "relative", height, width }}>
        {card ? (
          <FlashCard
            width={width}
            height={height}
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
              next();
              setStatus("idle");
            }}
            isFadingOut={status === "fading"}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default FlashCardsDeck;
