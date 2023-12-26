import { TextSelector } from "./getSelectedText";

/** 
 * Finds the selected text using the specified selector nodes. 
 * 
 * @returns The anchor and focus elements of the selection.
 */
export const createContentSelection: (params: [
  anchorNodeSelector: TextSelector,
  focusNodeSelector: TextSelector
]) => [anchor: HTMLElement, focus: HTMLElement] = ([anchorNodeSelector, focusNodeSelector]) => {
  try {
    const range = document.createRange();
    const anchorNode = document.querySelector(
      anchorNodeSelector.path
    ) as HTMLElement;
    const focusNode = document.querySelector(
      focusNodeSelector.path
    ) as HTMLElement;
    if (!focusNode) {
      throw new Error('Focused node not found')
    }

    const lastFocusNode = focusNode.childNodes.item(
      focusNodeSelector.textNodeIndex
    );

    if (anchorNode?.firstChild && lastFocusNode) {
      range.setStart(anchorNode.firstChild, anchorNodeSelector.offset);
      range.setEnd(lastFocusNode, focusNodeSelector.offset);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);

      return [anchorNode, focusNode];
    } else {
      throw new Error('LastFocusNode node not found')
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
