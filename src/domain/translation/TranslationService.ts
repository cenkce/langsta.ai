import { TranslatePropmpts } from "../../prompts/translate";
import { sendGPTRequest } from "../../services/gpt-api/sendGPTRequest";
import { useUserContentState } from "../content/ContentContext.atom";

export const useTranslateService = () => {
  const [selectedText] = useUserContentState();
  const translate = () => {
    if (selectedText?.selectedText)
      sendGPTRequest(createTranslateTextMessage(selectedText?.selectedText));
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