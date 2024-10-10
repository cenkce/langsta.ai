import React from 'react';
import { FlashCardData } from '../flash-cards/FlashCardData';

type QuestionsProps = {
  flashCardData: FlashCardData[];
  onShowAnswer: (word: string) => void;
  onTip: (word: string) => void;
  focusedWord?: string | null;
};

const Questions: React.FC<QuestionsProps> = ({ flashCardData, onShowAnswer, onTip, focusedWord }) => {
  const getQuestionStyle = (word: string) => {
    return word === focusedWord ? { backgroundColor: 'yellow' } : {};
  };

  return (
    <div>
      <h3>Questions</h3>
      <ul>
        {flashCardData.map((item, index) => (
          <li key={index} style={getQuestionStyle(item.word)}>
            {item.translation}
            <button onClick={() => onShowAnswer(item.word)} style={{ marginLeft: '10px' }}>
              Show
            </button>
            <button onClick={() => onTip(item.word)} style={{ marginLeft: '10px' }}>
              Tip
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Questions;