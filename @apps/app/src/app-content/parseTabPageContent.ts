import { Readability } from "@mozilla/readability";

export type ParsedContentType = ReturnType<typeof parseTabPageContent>;

export function parseTabPageContent() {
  const doc = document.implementation.createHTMLDocument();
  const newNode = doc.importNode(document.documentElement, true);
  doc.replaceChild(newNode, doc.documentElement);

  return new Readability(doc).parse();
}
