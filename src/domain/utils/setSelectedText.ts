import { TextSelector } from "./getSelectedText";

export const setSelectedText = (
  anchorNodeSelector: TextSelector,
  focusNodeSelector: TextSelector,
) => {
  const range = document.createRange();
  const anchorNode = document.querySelector(
    anchorNodeSelector.path
  ) as HTMLElement;
  const focusNode = document.querySelector(
    focusNodeSelector.path
  ) as HTMLElement;
  if(!focusNode)
    return;
    range

  const lastFocusNode = focusNode.childNodes.item(focusNodeSelector.textNodeIndex);
  if (anchorNode?.firstChild && lastFocusNode) {
    range.setStart(anchorNode.firstChild, anchorNodeSelector.offset);
    range.setEnd(lastFocusNode, focusNodeSelector.offset);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);
  }
};
