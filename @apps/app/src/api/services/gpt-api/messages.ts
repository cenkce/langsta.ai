import { UserContentState } from "../../../domain/content/ContentContext.atom";

export type ChatRequestMessage<T extends string, C = string> = {
  type: `gpt/${T}`,
  systemMessage: string,
  userMessage: string,
  id?: string,
  content: C;
  stream?: boolean;
};

export type TranslateRequestMessage = ChatRequestMessage<'translate', UserContentState['selectedText']> 


export type SimplyfyRequestMessage = ChatRequestMessage<'simplify'>;
export type ExtractWordsRequestMessage = ChatRequestMessage<'words'>;
export type SummariseContentRequestMessage = ChatRequestMessage<'summary'>;
export type GPTApiRequestMessages = ExtractWordsRequestMessage | TranslateRequestMessage | SimplyfyRequestMessage | SummariseContentRequestMessage;