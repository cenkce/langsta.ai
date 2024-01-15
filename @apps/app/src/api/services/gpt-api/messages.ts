import { ContentContextState } from "../../../domain/content/ContentContext.atom";

export type TranslateRequestMessage = {
  type: 'gpt/translate',
  systemMessage: string,
  id?: string,
  content: ContentContextState['selectedText'];
};

export type SimplyfyRequestMessage = {
  type: 'gpt/simplify',
  systemMessage: string,
  id?: string,
  content: string;
};

export type SummariseContentRequestMessage = {
  type: 'gpt/simplify',
  systemMessage: string,
  id?: string,
  content: string;
};

export type GPTApiRequestMessages = TranslateRequestMessage | SimplyfyRequestMessage | SummariseContentRequestMessage;