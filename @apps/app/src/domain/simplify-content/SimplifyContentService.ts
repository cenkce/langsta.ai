import { useMemo } from "react";
import { TargetLanguageLevel } from "../student/TargetLanguageLevel";
import { sendGPTRequest } from "../../api/services/gpt-api/sendGPTRequest";
import { simplifyContentSystemMessage } from "./simplifySystemMessage";
import { TranslatePropmpts } from "../../prompts/translate";

export const useSimplifyContentService = () => {
  const service = useMemo(() => new SimplifyContentService(), []);

  return service;
};
export class SimplifyContentService {
  constructor() {}

  simplifyContentByLevel(level: TargetLanguageLevel, content: string) {
    return new Promise((res) => {
      sendGPTRequest(
        {
          type: "gpt/simplify",
          content,
          systemMessage: TranslatePropmpts({
            level,
            targetLanguage: "en",
            nativeLanguage: "tr",
          }).systemTeacherMessage,
          userMessage: simplifyContentSystemMessage(level),
        },
        (response) => {
          res(response);
        },
      );
    });
  }
}
