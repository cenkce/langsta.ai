export type CompletionRequestMessage = {
  type: 'completion-request',
  systemMessage: string,
  content: string;
};
