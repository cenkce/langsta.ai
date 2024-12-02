import React, { useEffect, useMemo, useRef, useState } from "react";
import FlashCard, { FlashCardAction, FlashCardAnimState } from "./FlashCard";
import { FlashCardData } from "./FlashCardData";
import { ActionIcon, Box, Center, Title } from "@mantine/core";
import { ArrowLeft, ArrowRight } from "react-feather";

type FlashCardsDeckProps = {
  data: FlashCardData[];
  learnedWords?: string[];
  onAction?: (action: FlashCardAction, word: string) => void;
  actions?: FlashCardAction[];
  header?: string;
};

const FlashCardsDeck: React.FC<FlashCardsDeckProps> = ({
  data,
  onAction,
  header,
  actions,
}) => {
  const [cardsDict, words] = useMemo(() => {
    const dict = data.reduce<Record<string, FlashCardData>>((acc, d) => {
      acc[d.word] = d;
      return acc;
    }, {});

    return [dict, Object.keys(dict)];
  }, [data]);

  const [head, setHead] = useState(0);

  const prev = () => {
    if (words.length) setHead(head - 1 < 1 ? words.length : head - 1);
    else setHead(0);
    setAnimState("idle");
  };

  const next = () => {
    if (words.length) setHead(head + 1 > words.length ? 1 : head + 1);
    else setHead(0);
    setAnimState("idle");
  };

  const card = cardsDict[words[Math.max(head - 1, 0)]];
  const width = 500;
  const height = 400;
  const [animState, setAnimState] = useState<FlashCardAnimState>("idle");
  const nextActionRef = useRef<FlashCardAction | null>(null);

  useEffect(() => {
    if (animState === "fadedOut") {
      if (nextActionRef.current) {
        onAction?.(nextActionRef.current, card.word);
        setAnimState("idle");
      }
    }
  }, [animState]);

  useEffect(() => {
    if (words.length) next();
  }, [words.length]);

  return (
    <Box>
      <Box>
        <Title order={6}>{header}</Title>
      </Box>
      <Center style={{ gap: 10 }}>
        <ActionIcon onClick={() => prev()} size="compact-xs">
          <ArrowLeft />
        </ActionIcon>{" "}
        {head} / {words.length}
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
              nextActionRef.current = action;
              setAnimState("fading");
            }}
            actions={actions}
            onAnimStateChange={(state) => {
              setAnimState(state);
            }}
            animState={animState}
          />
        ) : null}
      </Box>
    </Box>
  );
};

export default FlashCardsDeck;
