import { useEffect, useState } from "react";
import type { ExtractTabContentMessage } from "../domain/content/messages";

// const words = {
//   extensions:
//     "Extensions are software programs, built on web technologies (such as HTML, CSS, and JavaScript) that enable users to customize the Chrome browsing experience.",
//   popup:
//     "A UI surface which appears when an extension's action icon is clicked.",
// };

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
