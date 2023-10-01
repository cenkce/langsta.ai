
export type TranslateRequestMessage = {
  type: 'gpt/translate',
  systemMessage: string,
  content: string;
};

export type SimplyfyRequestMessage = {
  type: 'gpt/simplify',
  systemMessage: string,
  content: string;
};

export type GPTMessages = TranslateRequestMessage | SimplyfyRequestMessage;