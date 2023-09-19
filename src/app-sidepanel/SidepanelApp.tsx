import { useEffect, useState } from "react";
import type { ExtractTabContentMessage } from "../domain/content/messages";

export const SidepanelApp = () => {
  const [content, setContent] = useState<string>();

  useEffect(() => {
    console.log("SidepanelApp");
    chrome.runtime.onMessage.addListener(
      (message: ExtractTabContentMessage) => {
        console.log('SidepanelApp')
        if (
          message.type === "extract-tab-content" &&
          document &&
          document?.body
        ) {
          console.log(message);
          setContent(message.payload?.textContent || "");
        }
      }
    );
  }, []);

  return (
    <div>
      <h2 id="definition-word">Learn Smarter</h2>
      <p id="definition-text">{content}</p>
    </div>
  );
};
