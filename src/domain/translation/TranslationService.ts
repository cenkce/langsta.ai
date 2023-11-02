import { TranslatePropmpts } from "../../prompts/translate";
import { sendGPTRequest } from "../../services/gpt-api/sendGPTRequest";

export const useTranslateService = () => {
  const translate = (text: string) => {
    if (text)
      sendGPTRequest(createTranslateTextMessage(text));
  };
  return {
    translate,
  };
};

export function createTranslateTextMessage(text: string){
  return {
    type: "gpt/translate",
    content: text,
    systemMessage: TranslatePropmpts.translate_text_string,
  } as const;
}