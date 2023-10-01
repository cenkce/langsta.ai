import { useMemo } from "react";
import { MLService } from "../../core/MLService";
import { TargetLanguageLevel } from "../student/TargetLanguageLevel";
import { sendGPTRequest } from "../../services/gpt-api/sendGPTRequest";
import { simplifyContentSystemMessage } from "./simplifySystemMessage";

export const useSimplifyContentService = () => {
  const service = useMemo(() => new SimplifyContentService(), []);

  return service;
};
export class SimplifyContentService extends MLService {
  constructor() {
    super();
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
          console.log(response);
          res(response);
        }
      );
    });
  }
}
