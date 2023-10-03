import { useUserContentState } from "../domain/content/ContentContext.atom";

export const SidepanelApp = () => {
  const [userContent] = useUserContentState();
  console.log("userContent?.translation : ", userContent);

  return (
    <div>
      <h2>Learn Smarter</h2>
      <p id="definition-text">{userContent?.selectedText}</p>
      <p id="definition-text-tranlation">{userContent?.translation?.translation}</p>
    </div>
  );
};
