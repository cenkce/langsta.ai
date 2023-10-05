import { TranslatePropmpts } from "../../prompts/translate";
import { sendGPTRequest } from "../../services/gpt-api/sendGPTRequest";
import { useUserContentState } from "../content/ContentContext.atom";

export const useTranslateService = () => {
  const [selectedText] = useUserContentState();
  const translate = () => {
    if (selectedText?.selectedText)
      sendGPTRequest({
        type: "gpt/translate",
        content: selectedText?.selectedText,
        systemMessage: TranslatePropmpts.tranlate,
      });
  };
  return {
    translate,
  };
};