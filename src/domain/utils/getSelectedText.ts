import { getDomPath } from "./getDomPath";

export const getSelectedText = () => window.getSelection()?.toString() || "";
export const getSelectedTextParentElement = () =>
  window.getSelection()?.anchorNode?.parentElement;

export const getSelectedTextSelectors = () => {
  const selection = window.getSelection();
  if (selection?.anchorNode && selection?.focusNode) {
    const [anchorPath, anchorTextNodeIndex] = getDomPath(selection.anchorNode);
    const [focusPath, focusTextNodeIndex] = getDomPath(selection.focusNode);

    return [
      {
        path: anchorPath.join(" "),
        textNodeIndex: anchorTextNodeIndex,
        content: selection.anchorNode.textContent,
        offset: selection.anchorOffset,
      },
      {
        path: focusPath.join(" "),
        textNodeIndex: focusTextNodeIndex,
        content: selection.focusNode.textContent,
        offset: selection.focusOffset,
      },
    ] as [anchor: TextSelector, focus: TextSelector];
  }
};

export type TextSelector = {
  path: string;
  textNodeIndex: number;
  content: string | null;
  offset: number;
};
