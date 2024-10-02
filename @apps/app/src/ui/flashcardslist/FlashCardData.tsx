
export type Example = {
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
