import { useUserContentValue } from "../domain/content/ContentContext.atom";

export const SidepanelApp = () => {
  const userContent = useUserContentValue();
  console.log("userContent : ", userContent);

  return (
    <div>
      <h2 id="definition-word">Learn Smarter</h2>
      <p id="definition-text">{userContent?.selectedText}</p>
    </div>
  );
};
