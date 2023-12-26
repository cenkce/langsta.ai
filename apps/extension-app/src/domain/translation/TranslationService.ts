import { nanoid } from "nanoid";
import { TranslatePropmpts } from "../../prompts/translate";
import { TranslateRequestMessage } from "../../api/services/gpt-api/messages";
import { sendGPTRequest } from "../../api/services/gpt-api/sendGPTRequest";
import { ContentContextState } from "../content/ContentContext.atom";

export const useTranslateService = () => {
  const translate = (selection: ContentContextState['selectedText']) => {
    const id = nanoid();
    if (selection)
      sendGPTRequest(createTranslateTextMessage(selection, id));

    return id;
  };
  return {
    translate,
  };
};

export function createTranslateTextMessage(selection: ContentContextState['selectedText'], id?: string){
  return {
    type: "gpt/translate",
    content: selection,
    id,
    systemMessage: TranslatePropmpts.translate_text_string,
  } as TranslateRequestMessage;
}