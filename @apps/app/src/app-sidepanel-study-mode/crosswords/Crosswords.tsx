import React, { useState, useEffect } from 'react';
import { generateLayout } from 'crossword-layout-generator';
import './Crosswords.css';

export interface WordEntry {
  id?: number;
  answer: string;
  clue: string;
}

const App: React.FC<{words: WordEntry[]}> = ({words}) => {
  const [grid, setGrid] = useState<string[][]>([]);

  useEffect(() => {
    if (words.length > 0) {
      const layout = generateLayout(words, { width: 15, height: 15 });
      console.log('layout', layout);
      setGrid(layout.table);
    }
  }, [words]);


  // const handleCellChange = (row: number, col: number, value: string) => {
  //   const updatedGrid = grid.map((gridRow) =>
  //     gridRow.map((cell) => {
  //       if (cell.row === row && cell.col === col) {
  //         return { ...cell, char: value.toUpperCase() };
  //       }
  //       return cell;
  //     })
  //   );
  //   setGrid(updatedGrid);
  // };


  return (
    <div className="app">
      <h1>Dynamic Crossword Puzzle</h1>
      {grid.length > 0 && (
        <div className="crossword-container">
          <CrosswordGrid grid={grid} />
        </div>
      )}
    </div>
  );
};

// WordInput Component
// const WordInput: React.FC<{ addWord: (wordEntry: WordEntry) => void }> = ({
//   addWord,
// }) => {
//   const [word, setWord] = useState('');
//   const [clue, setClue] = useState('');

//   const handleAddWord = () => {
//     if (word.trim() && clue.trim()) {
//       const newWordEntry: WordEntry = {
//         id: Date.now(),
//         answer: word.trim().toUpperCase(),
//         clue: clue.trim(),
//       };
//       addWord(newWordEntry);
//       setWord('');
//       setClue('');
//     }
//   };

//   return (
//     <div className="word-input">
//       <input
//         type="text"
//         value={word}
//         onChange={(e) => setWord(e.target.value)}
//         placeholder="Enter word"
//       />
//       <input
//         type="text"
//         value={clue}
//         onChange={(e) => setClue(e.target.value)}
//         placeholder="Enter clue"
//       />
//       <button onClick={handleAddWord}>Add Word</button>
//     </div>
//   );
// };

// CrosswordGrid Component
const CrosswordGrid: React.FC<{
  grid: string[][];
  // onCellChange: (row: number, col: number, value: string) => void;
}> = ({ grid }) => {
  return (
    <div className="crossword-grid">
      {grid.map((row, rowIndex) => (
        <div className="crossword-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div
              className={`crossword-cell ${cell === '-' ? 'block' : 'white'}`}
              key={colIndex}
            >
              {cell !== '-' && (
                <input
                  type="text"
                  maxLength={1}
                  value={''}
                  onChange={() => {  }
                    // onCellChange(cell, cell.col, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;