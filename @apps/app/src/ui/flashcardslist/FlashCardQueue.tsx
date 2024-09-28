import React, { useState } from 'react';
import FlashCard from './FlashCard';

type Example = {
  example: string;
  translation: string;
};

export type FlashCardData = {
  word: string;
  translation: string;
  description?: string;
  image?: string;
  examples: Example[];
};

type FlashCardQueueProps = {
  data: FlashCardData[];
};

const FlashCardQueue: React.FC<FlashCardQueueProps> = ({ data }) => {
  const [queue, setQueue] = useState(data);
  const [fadingOutIndex, setFadingOutIndex] = useState<number | null>(null);

  const removeCard = (index: number) => {
    setFadingOutIndex(index);
    setTimeout(() => {
      setQueue(queue.filter((_, i) => i !== index));
      setFadingOutIndex(null);
    }, 1000); // 1 second fade-out duration
  };

  return (
    <div style={{ position: 'relative', height: '400px' }}>
      {queue.map((card, index) => (
        <FlashCard
          key={index}
          index={index}
          {...card}
          onRemove={() => removeCard(index)}
          isFadingOut={index === fadingOutIndex}
        />
      ))}
    </div>
  );
};

export default FlashCardQueue;