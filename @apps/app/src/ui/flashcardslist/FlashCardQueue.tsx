import React, { useState } from 'react';

type Example = {
  example: string;
  translation: string;
};

type FlashCardData = {
  word: string;
  translation: string;
  description?: string;
  image?: string;
  examples: Example[];
};

type CrosswordPuzzleProps = {
  flashCardData: FlashCardData[];
};

const CrosswordPuzzle: React.FC<CrosswordPuzzleProps> = ({ flashCardData }) => {
  const [answers, setAnswers] = useState<string[][]>([]);

  // Generate crossword grid
  const generateGrid = (data: FlashCardData[]) => {
    // Placeholder logic for generating grid
    // You can implement a more sophisticated algorithm here
    const gridSize = 10;
    const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
    data.forEach((item, index) => {
      const word = item.word;
      for (let i = 0; i < word.length; i++) {
        grid[index][i] = word[i];
      }
    });
    return grid;
  };

  const grid = generateGrid(flashCardData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const newAnswers = [...answers];
    newAnswers[row][col] = e.target.value;
    setAnswers(newAnswers);
  };

  const checkAnswers = () => {
    // Placeholder logic for checking answers
    // You can implement a more sophisticated algorithm here
    console.log('Checking answers...');
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <table>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type="text"
                      maxLength={1}
                      value={answers[rowIndex]?.[colIndex] || ''}
                      onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <h3>Questions</h3>
        <ul>
          {flashCardData.map((item, index) => (
            <li key={index}>{item.description}</li>
          ))}
        </ul>
      </div>
      <button onClick={checkAnswers}>Check Answers</button>
    </div>
  );
};

export default CrosswordPuzzle;