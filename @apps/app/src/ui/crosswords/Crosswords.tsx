import React, { useState, useEffect, useRef } from 'react';
import { FlashCardData } from '../flashcardslist/FlashCardData';
import {
  calculateGridSize,
  generateGrid,
  trimGrid,
  handleKeyDown,
  findWordAtCell,
  handleShowAnswer,
  checkAnswers,
} from './utils';
import Questions from './Questions'; // Import the Questions component

type CrosswordPuzzleProps = {
  flashCardData: FlashCardData[];
};

const CrosswordPuzzle: React.FC<CrosswordPuzzleProps> = ({ flashCardData }) => {
  const [answers, setAnswers] = useState<string[][]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordCorrectness, setWordCorrectness] = useState<(boolean | null)[][]>([]);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number; word: string } | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  useEffect(() => {
    initializeBoard();
  }, [flashCardData]);

  const initializeBoard = () => {
    const gridSize = calculateGridSize(flashCardData);
    const generatedGrid = generateGrid(flashCardData, gridSize);
    const trimmedGrid = trimGrid(generatedGrid);
    setGrid(trimmedGrid);
    setAnswers(Array(trimmedGrid.length).fill(null).map(() => Array(trimmedGrid[0].length).fill('')));
    setWordCorrectness(Array(trimmedGrid.length).fill(null).map(() => Array(trimmedGrid[0].length).fill(null)));
    inputRefs.current = Array(trimmedGrid.length).fill(null).map(() => Array(trimmedGrid[0].length).fill(null));
  };

  useEffect(() => {
    if (grid.length > 0) {
      checkAnswers(flashCardData, grid, answers, setWordCorrectness)();
    }
  }, [answers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
    const newAnswers = answers.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => (rowIndex === row && colIndex === col ? e.target.value : cell))
    );
    setAnswers(newAnswers);
  };

  const handleFocus = (row: number, col: number) => {
    const word = findWordAtCell(flashCardData, grid)(row, col);
    setFocusedCell({ row, col, word });
  };

  const getBorderColor = (rowIndex: number, colIndex: number) => {
    if (wordCorrectness[rowIndex][colIndex] === null) {
      return '1px solid black';
    }
    return wordCorrectness[rowIndex][colIndex] ? '2px solid green' : '2px solid red';
  };

  const handleTip = (word: string) => {
    const newAnswers = [...answers];

    // Find the word in the grid and reveal a random unused letter
    const positions: { row: number; col: number; letterIndex: number }[] = [];

    // Check horizontally
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c <= grid[r].length - word.length; c++) {
        if (grid[r].slice(c, c + word.length).join('') === word) {
          for (let i = 0; i < word.length; i++) {
            if (newAnswers[r][c + i] === '') {
              positions.push({ row: r, col: c + i, letterIndex: i });
            }
          }
        }
      }
    }

    // Check vertically
    for (let c = 0; c < grid[0].length; c++) {
      for (let r = 0; r <= grid.length - word.length; r++) {
        if (grid.slice(r, r + word.length).map(row => row[c]).join('') === word) {
          for (let i = 0; i < word.length; i++) {
            if (newAnswers[r + i][c] === '') {
              positions.push({ row: r + i, col: c, letterIndex: i });
            }
          }
        }
      }
    }

    if (positions.length > 0) {
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      newAnswers[randomPosition.row][randomPosition.col] = word[randomPosition.letterIndex];
      setAnswers(newAnswers);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <button onClick={initializeBoard} style={{ marginBottom: '10px' }}>Regenerate</button>
        <table>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} style={{ padding: 1, border: 'none', height: '30px' }}>
                    {cell !== '' ? (
                      wordCorrectness[rowIndex][colIndex] ? (
                        <div
                          style={{
                            width: '20px',
                            height: '100%',
                            textAlign: 'center',
                            lineHeight: '20px',
                            border: getBorderColor(rowIndex, colIndex),
                            fontSize: '14px'
                          }}
                        >
                          {answers[rowIndex][colIndex]}
                        </div>
                      ) : (
                        <input
                          type="text"
                          maxLength={1}
                          value={answers[rowIndex]?.[colIndex] || ''}
                          onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                          onFocus={() => handleFocus(rowIndex, colIndex)}
                          onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex, inputRefs, grid)}
                          ref={(el) => {
                            if (!inputRefs.current[rowIndex]) {
                              inputRefs.current[rowIndex] = [];
                            }
                            inputRefs.current[rowIndex][colIndex] = el;
                          }}
                          style={{
                            width: '20px',
                            height: '100%',
                            textAlign: 'center',
                            border: getBorderColor(rowIndex, colIndex),
                            fontSize: '14px'
                          }}
                        />
                      )
                    ) : (
                      <div style={{ width: '100%', height: '100%', backgroundColor: 'black' }}></div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginLeft: '20px' }}>
        <Questions flashCardData={flashCardData} onShowAnswer={handleShowAnswer(flashCardData, grid, answers, setAnswers)} onTip={handleTip} focusedWord={focusedCell?.word} />
      </div>
    </div>
  );
};

export default CrosswordPuzzle;