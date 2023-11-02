import { getDomPath } from "./getDomPath";

export const getSelectedText = () => window.getSelection()?.toString() || "";
export const getSelectedTextParentElement = () =>
  window.getSelection()?.anchorNode?.parentElement;

export const getSelectedTextSelectors = () => {
  const selection = window.getSelection();
    if (selection?.anchorNode && selection?.focusNode) {
    const {path: anchorPath, textNodeIndex: anchorTextNodeIndex, position: anchorPosition} = getDomPath(selection.anchorNode);
    const {path: focusPath, textNodeIndex: focusTextNodeIndex, position: focusNodePosition} = getDomPath(selection.focusNode);

    const selectionRange = [
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
    ] as [started: TextSelector, stopped: TextSelector];

    // check if the selection is backwards
    if(anchorPosition > focusNodePosition)
      selectionRange.reverse();

    return selectionRange;
  }
};

export type TextSelector = {
  path: string;
  textNodeIndex: number;
  content: string | null;
  offset: number;
};
