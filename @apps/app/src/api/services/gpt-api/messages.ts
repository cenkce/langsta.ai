import { UserContentState } from "../../../domain/content/ContentContext.atom";

export type TranslateRequestMessage = {
  type: 'gpt/translate',
  systemMessage: string,
  id?: string,
  content: UserContentState['selectedText'];
};

export type SimplyfyRequestMessage = {
  type: 'gpt/simplify',
  systemMessage: string,
  id?: string,
  content: string;
  stream?: boolean;
};

export type ExtractWordsRequestMessage = {
  type: 'gpt/words',
  systemMessage: string,
  id?: string,
  content: string;
  stream?: boolean;
};

export type SummariseContentRequestMessage = {
  type: 'gpt/summary',
  systemMessage: string,
  id?: string,
  content: string;
  stream?: boolean;
};

export type GPTApiRequestMessages = ExtractWordsRequestMessage | TranslateRequestMessage | SimplyfyRequestMessage | SummariseContentRequestMessage;