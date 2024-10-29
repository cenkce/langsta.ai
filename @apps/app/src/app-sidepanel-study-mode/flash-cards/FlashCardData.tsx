import { WordDescriptor } from "../../domain/user/WordDescriptor";

export type Example = {
  example: string;
  translation: string;
};

export type FlashCardData = {
  word: string;
  descriptor?: WordDescriptor;
  image?: string;
  examples?: string[];
  isLearned?: boolean;
};
