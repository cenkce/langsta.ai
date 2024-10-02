// should calculate the by nodes because text nodes is needed end of the selection.
export function getDomPath(el: Node) {
  const stack: string[] = [];
  let currentNode: Node | null = el;
  let textNodeIndex = 0;
  let pos = 0;

  while (
    currentNode?.parentNode?.nodeName !== "body" &&
    currentNode?.parentNode !== null
  ) {
    let sibCount = 1;
    let sibIndex = 1;
    if (!currentNode) break;
    for (let i = 0; i < currentNode.parentNode.childNodes.length; i++) {
      const sib: ChildNode = currentNode.parentNode.childNodes.item(i);
      if (sib === currentNode) {
        sibIndex = sibCount;
        break;
      }
      if (
        sib.nodeType === Node.ELEMENT_NODE ||
        currentNode.nodeType === Node.TEXT_NODE
      ) {
        sibCount++;
      }
      pos++;
    }

    if (currentNode.nodeType === Node.TEXT_NODE) {
      textNodeIndex = sibIndex - 1;
    } else if (sibCount > 1) {
      stack.unshift(`*:nth-child(${sibIndex})`);
    } else {
      stack.unshift(currentNode.nodeName.toLowerCase());
    }

    currentNode = currentNode.parentElement;
  }
  return { path: stack.slice(1), textNodeIndex, position: pos } as const; // removes the html element
}
