function escapeRegexSpecialChars(textToEscape: string) {
  return textToEscape.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export function findContentNode(
  node: ChildNode,
  replacementDetails: Record<string, any>
) {
  const nodeList = node.childNodes;

  for (let x = 0; x < nodeList.length; x++) {
    // text node, search directly
    if (nodeList[x].nodeType == 3) {
      Object.keys(replacementDetails).forEach((key) => {
        const textContent = nodeList[x].textContent;
        if (textContent !== null && textContent.length > 20) {
          console.debug(key);
        }
      });
    } else
      replaceValuesInHtmlDocumentTextContent(nodeList[x], replacementDetails);
  }
}

export function replaceValuesInHtmlDocumentTextContent(
  node: ChildNode,
  replacementDetails: Record<string, any>
) {
  const nodeList = node.childNodes;

  for (let x = 0; x < nodeList.length; x++) {
    // text node, search directly
    if (nodeList[x].nodeType == 3) {
      Object.keys(replacementDetails).forEach((key) => {
        const search = escapeRegexSpecialChars(replacementDetails[key].search);
        if (nodeList[x].textContent !== null)
          nodeList[x].textContent = nodeList[x].textContent!.replace(
            new RegExp(search, "gi"),
            replacementDetails[key].replace
          );
      });
    } else
      replaceValuesInHtmlDocumentTextContent(nodeList[x], replacementDetails);
  }
}
