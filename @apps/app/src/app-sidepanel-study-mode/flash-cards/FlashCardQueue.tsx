import React, { useState } from "react";
import FlashCard, { FlashCardAction } from "./FlashCard";
import { FlashCardData } from "./FlashCardData";

type FlashCardQueueProps = {
  data: FlashCardData[];
  learnedWords?: string[];
  onAction?: (action: FlashCardAction, index: number) => void;
};

const FlashCardQueue: React.FC<FlashCardQueueProps> = ({ data, onAction }) => {
  const [queue, setQueue] = useState(data);
  const [fadingOutIndex, setFadingOutIndex] = useState<number | null>(null);

  const removeCard = (action: FlashCardAction, index: number) => {
    setFadingOutIndex(index);
    setTimeout(() => {
      setQueue(queue.filter((_, i) => i !== index));
      setFadingOutIndex(null);
    }, 1000); // 1 second fade-out duration
    onAction?.(action, index);
  };

  console.log(queue);

  return (
    <div style={{ position: "relative", height: "400px" }}>
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
    </div>
  );
};

export default FlashCardQueue;
