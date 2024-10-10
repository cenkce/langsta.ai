export type WordDescriptor = { translation: string; kind: string; examples: Array<{[key: string]: string}> };
export type WordsCollection = Record<string, WordDescriptor>;
export type WordsDict = Record<string, WordDescriptor>;