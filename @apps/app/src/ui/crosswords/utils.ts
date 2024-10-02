import { FlashCardData } from "../flashcardslist/FlashCardData";

export const calculateGridSize = (data: FlashCardData[]) => {
  const longestWordLength = Math.max(...data.map(item => item.word.length));
  const estimatedSize = Math.ceil(Math.sqrt(data.length)) * longestWordLength;
  return Math.max(estimatedSize, 15); // Ensure a minimum grid size of 15
};

export const generateGrid = (flashCardData: FlashCardData[], gridSize: number): string[][] => {
  const grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

  const placeWord = (word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean => {
    if (direction === 'horizontal') {
      if (col + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
      }
      for (let i = 0; i < word.length; i++) {
        grid[row][col + i] = word[i];
      }
    } else {
      if (row + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
      }
      for (let i = 0; i < word.length; i++) {
        grid[row + i][col] = word[i];
      }
    }
    return true;
  };

  const canPlaceWord = (word: string, row: number, col: number, direction: 'horizontal' | 'vertical'): boolean => {
    if (direction === 'horizontal') {
      if (col + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
      }
    } else {
      if (row + word.length > gridSize) return false;
      for (let i = 0; i < word.length; i++) {
        if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
      }
    }
    return true;
  };

  const placeWords = () => {
    for (const { word } of flashCardData) {
      let placed = false;
      for (let attempts = 0; attempts < 100 && !placed; attempts++) {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);

        if (canPlaceWord(word, row, col, direction)) {
          placed = placeWord(word, row, col, direction);
        }
      }
    }
  };

  placeWords();
  return grid;
};

export const canPlaceWord = (
  word: string,
  row: number,
  col: number,
  horizontal: boolean,
  grid: string[][],
  gridSize: number
) => {
  if (horizontal) {
    if (col + word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
      if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
    }
  } else {
    if (row + word.length > gridSize) return false;
    for (let i = 0; i < word.length; i++) {
      if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
    }
  }
  return true;
};

export const findIntersection = (word: string, grid: string[][], gridSize: number) => {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (grid[row][col] !== '') {
        const letter = grid[row][col];
        const index = word.indexOf(letter);
        if (index !== -1) {
          const horizontal = Math.random() > 0.5;
          const startRow = horizontal ? row : row - index;
          const startCol = horizontal ? col - index : col;
          if (canPlaceWord(word, startRow, startCol, horizontal, grid, gridSize)) {
            return { row: startRow, col: startCol, horizontal };
          }
        }
      }
    }
  }
  return null;
};

export const trimGrid = (grid: string[][]) => {
  let minRow = grid.length, maxRow = 0, minCol = grid[0].length, maxCol = 0;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] !== '') {
        if (row < minRow) minRow = row;
        if (row > maxRow) maxRow = row;
        if (col < minCol) minCol = col;
        if (col > maxCol) maxCol = col;
      }
    }
  }

  const trimmedGrid = grid.slice(minRow, maxRow + 1).map(row => row.slice(minCol, maxCol + 1));
  return trimmedGrid;
};

export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  row: number,
  col: number,
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[][]>,
  grid: string[][]
) => {
  switch (e.key) {
    case 'ArrowUp':
      if (row > 0 && inputRefs.current[row - 1][col]) {
        inputRefs.current[row - 1][col]?.focus();
      }
      break;
    case 'ArrowDown':
      if (row < grid.length - 1 && inputRefs.current[row + 1][col]) {
        inputRefs.current[row + 1][col]?.focus();
      }
      break;
    case 'ArrowLeft':
      if (col > 0 && inputRefs.current[row][col - 1]) {
        inputRefs.current[row][col - 1]?.focus();
      }
      break;
    case 'ArrowRight':
      if (col < grid[row].length - 1 && inputRefs.current[row][col + 1]) {
        inputRefs.current[row][col + 1]?.focus();
      }
      break;
    default:
      break;
  }
};

export const findWordAtCell = (flashCardData: FlashCardData[], grid: string[][]) => (row: number, col: number): string => {
  for (const item of flashCardData) {
    const word = item.word;

    // Check horizontally
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c <= grid[r].length - word.length; c++) {
        if (grid[r].slice(c, c + word.length).join('') === word) {
          if (r === row && c <= col && col < c + word.length) {
            return word;
          }
        }
      }
    }

    // Check vertically
    for (let c = 0; c < grid[0].length; c++) {
      for (let r = 0; r <= grid.length - word.length; r++) {
        if (grid.slice(r, r + word.length).map(row => row[c]).join('') === word) {
          if (c === col && r <= row && row < r + word.length) {
            return word;
          }
        }
      }
    }
  }
  return '';
};

export const handleShowAnswer = (flashCardData: FlashCardData[], grid: string[][], answers: string[][], setAnswers: React.Dispatch<React.SetStateAction<string[][]>>) => (word: string) => {
  const newAnswers = [...answers];

  // Find the word in the grid and fill in the answers
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col <= grid[row].length - word.length; col++) {
      if (grid[row].slice(col, col + word.length).join('') === word) {
        for (let i = 0; i < word.length; i++) {
          newAnswers[row][col + i] = word[i];
        }
        setAnswers(newAnswers);
        return;
      }
    }
  }

  for (let col = 0; col < grid[0].length; col++) {
    for (let row = 0; row <= grid.length - word.length; row++) {
      if (grid.slice(row, row + word.length).map(r => r[col]).join('') === word) {
        for (let i = 0; i < word.length; i++) {
          newAnswers[row + i][col] = word[i];
        }
        setAnswers(newAnswers);
        return;
      }
    }
  }
};

export const checkAnswers = (flashCardData: FlashCardData[], grid: string[][], answers: string[][], setWordCorrectness: React.Dispatch<React.SetStateAction<(boolean | null)[][]>>) => () => {
  const newWordCorrectness: (boolean | null)[][] = grid.map(row => row.map(() => null));

  flashCardData.forEach(item => {
    const word = item.word;
    let correct = true;

    // Check horizontally
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col <= grid[row].length - word.length; col++) {
        if (grid[row].slice(col, col + word.length).join('') === word) {
          for (let i = 0; i < word.length; i++) {
            if (answers[row][col + i] !== word[i]) {
              correct = false;
              break;
            }
          }
          for (let i = 0; i < word.length; i++) {
            newWordCorrectness[row][col + i] = correct;
          }
        }
      }
    }

    // Check vertically
    for (let col = 0; col < grid[0].length; col++) {
      for (let row = 0; row <= grid.length - word.length; row++) {
        if (grid.slice(row, row + word.length).map(r => r[col]).join('') === word) {
          for (let i = 0; i < word.length; i++) {
            if (answers[row + i][col] !== word[i]) {
              correct = false;
              break;
            }
          }
          for (let i = 0; i < word.length; i++) {
            newWordCorrectness[row + i][col] = correct;
          }
        }
      }
    }
  });

  setWordCorrectness(newWordCorrectness);
};