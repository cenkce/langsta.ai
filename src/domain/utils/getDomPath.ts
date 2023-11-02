// should calculate the by nodes because text nodes is needed end of the selection.
export function getDomPath(el: Node) {
  const stack: string[] = [];
  let currentNode: Node | null = el;
  let textNodeIndex = 0;
  while (
    currentNode?.parentNode?.nodeName !== "body" &&
    currentNode?.parentNode !== null
  ) {
    let sibCount = 1;
    let sibIndex = 1;
    if (!currentNode) break;
    for (let i = 0; i < currentNode.parentNode.childNodes.length; i++) {
      const sib = currentNode.parentNode.childNodes.item(i);
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
    }

    if (currentNode.nodeType === Node.TEXT_NODE) {
      textNodeIndex = sibIndex - 1;
    } else if (sibCount > 1) {
      stack.unshift(`*:nth-child(${sibIndex})`);
    } else {
      console.log("currentNode.nodeType : ", currentNode.nodeType);
      stack.unshift(currentNode.nodeName.toLowerCase());
    }

    currentNode = currentNode.parentElement;
  }
  return [stack.slice(1), textNodeIndex] as const; // removes the html element
}
