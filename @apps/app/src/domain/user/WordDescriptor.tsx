export type WordDescriptor = { translation: string; kind: string; examples: Array<{[key: string]: string}> };
export type WordsCollection = Map<string, WordDescriptor>;
export type WordsDict = Record<string, WordDescriptor>;
