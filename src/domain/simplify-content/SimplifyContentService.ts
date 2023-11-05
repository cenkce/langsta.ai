import { useMemo } from "react";
import { TargetLanguageLevel } from "../student/TargetLanguageLevel";
import { sendGPTRequest } from "../../services/gpt-api/sendGPTRequest";
import { simplifyContentSystemMessage } from "./simplifySystemMessage";

export const useSimplifyContentService = () => {
  const service = useMemo(() => new SimplifyContentService(), []);

  return service;
};
export class SimplifyContentService {
  constructor() {
  }

  simplifyContentByLevel(level: TargetLanguageLevel, content: string) {
    return new Promise((res) => {
      sendGPTRequest(
        {
          type: "gpt/simplify",
          content,
          systemMessage: simplifyContentSystemMessage(level),
        },
        (response) => {
          res(response);
        }
      );
    });
  }
}
