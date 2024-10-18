/// <reference types="vite/client" />
/// <reference types="vitest" />

declare const __DEV__: boolean;
interface ReadableStream<R = any> {
  [Symbol.asyncIterator](): AsyncIterableIterator<R>;
}

declare module 'crossword-layout-generator' {
  export interface Cell {
    row: number;
    col: number;
    char: string;
    isBlock: boolean;
  }

  export interface Word {
    answer: string;
    clue: string;
  }

  export type Result = {
    answer: string;
    clue: string;
    orientation: "across" | "down";
    position: number;
    startx: number;
    starty: number;
  }

  export interface CrosswordLayout {
    cols: number;
    rows: number;
    table: string[][];
    result: Result[];
  }

  export function generateLayout(
    words: Word[],
    options?: { width?: number; height?: number }
  ): CrosswordLayout;
}