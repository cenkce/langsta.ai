import { Readability } from "@mozilla/readability";

export type ParsedContentType = ReturnType<typeof parseContent>;

export function parseContent() {
  const doc = document.implementation.createHTMLDocument();
  const newNode = doc.importNode(document.documentElement, true);
  doc.replaceChild(newNode, doc.documentElement);

  return new Readability(doc).parse();
}
