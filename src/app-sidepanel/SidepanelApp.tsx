import { useUserContentValue } from "../domain/content/ContentContext.atom";

export const SidepanelApp = () => {
  const userContent = useUserContentValue();
  console.log("userContent : ", userContent);

  // useEffect(() => {
  //   console.log("SidepanelApp");
  //   chrome.runtime.onMessage.addListener(
  //     (message: ExtractTabContentMessage) => {
  //       console.log('SidepanelApp')
  //       if (
  //         message.type === "extract-tab-content" &&
  //         document &&
  //         document?.body
  //       ) {
  //         console.log(message);
  //         // setContent(message.payload?.textContent || "");
  //       }
  //     }
  //   );
  // }, []);

  return (
    <div>
      <h2 id="definition-word">Learn Smarter</h2>
      <p id="definition-text">{userContent.selectedText}</p>
    </div>
  );
};
