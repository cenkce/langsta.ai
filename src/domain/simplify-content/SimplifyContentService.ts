import { useMemo } from "react";
import { MLService } from "../core/MLService";
import { TargetLanguageLevel } from "../student/TargetLanguageLevel";
import { sendChatGPTRequestMessage } from "../../services/gpt-api/sendChatGPTRequestMessage";
import { simplifyContentSystemMessage } from "./simplifySystemMessage";

export const useSimplifyContentService = () => {
  const service = useMemo(() => new SimplifyContentService(), []);

  return service;
};
export class SimplifyContentService extends MLService {
  constructor() {
    super();
  }

  simplifyCOntentByLevel(level: TargetLanguageLevel, content: string) {
    return new Promise((res) => {
      sendChatGPTRequestMessage(
        {
          type: "completion-request",
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
