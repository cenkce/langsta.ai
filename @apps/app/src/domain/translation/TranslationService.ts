import { nanoid } from "nanoid";
import { TranslatePropmpts } from "../../prompts/translate";
import {
  SimplyfyRequestMessage,
  SummariseContentRequestMessage,
  TranslateRequestMessage,
} from "../../api/services/gpt-api/messages";
import { sendGPTRequest } from "../../api/services/gpt-api/sendGPTRequest";
import { UserContentState } from "../content/ContentContext.atom";
import { SettingsAtom } from "../user/SettingsModel";
import { useAtom } from "@espoojs/atom";

export const useTranslateService = () => {
  const [settings] = useAtom(SettingsAtom);

  const translate = (selection: UserContentState["selectedText"]) => {
    const id = nanoid();
    if (selection)
      sendGPTRequest(
        createTranslateTextMessage({ selection, id, language: "Turkish" }),
      );

    return id;
  };
  const summarise = (content?: string) => {
    if(!content )
      return;
    const id = nanoid();

    if (content && settings.nativelanguage && settings.level)
      sendGPTRequest(
        createSummariseRequestMessage({
          content,
          id,
          language: settings.nativelanguage,
          level: settings.level,
        }),
      );

    return id;
  };
  const simplify = (content?: string) => {
    if(!content )
      return;
    const id = nanoid();
    if (content && settings.nativelanguage && settings.level)
      sendGPTRequest(
        createSimplyfyRequestMessage({
          content,
          id,
          language: settings.nativelanguage,
          level: settings.level,
        }),
      );

    return id;
  };
  return {
    translate,
    summarise,
    simplify
  };
};

export function createTranslateTextMessage(options: {
  language: string;
  level?: string;
  selection: UserContentState["selectedText"];
  id?: string;
}) {
  return {
    type: "gpt/translate",
    content: options.selection,
    id: options.id || nanoid(),
    systemMessage: TranslatePropmpts({
      language: options.language,
      level: options.level,
    }).translate_text_string,
  } as TranslateRequestMessage;
}

export function createSimplyfyRequestMessage(options: {
  language: string;
  level: string;
  content: string;
  id?: string;
}) {
  return {
    type: "gpt/simplify",
    content: options.content,
    id: options.id || nanoid(),
    systemMessage: TranslatePropmpts({
      language: options.language,
      level: options.level,
    }).simplfy_text,
  } as SimplyfyRequestMessage;
}

export function createSummariseRequestMessage(options: {
  language: string;
  level: string;
  content: string;
  id?: string;
}) {
  return {
    type: "gpt/summarise",
    content: options.content,
    id: options.id || nanoid(),
    systemMessage: TranslatePropmpts({
      language: options.language,
      level: options.level,
    }).summarise_text,
  } as SummariseContentRequestMessage;
}
