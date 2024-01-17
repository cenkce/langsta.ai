export const TranslatePropmpts = ({language, level}:{language: string, level?: string}) => ({
  tranlate_with_words: `Translate specified paragraph to ${language} and extract words with translations as json format and generate your answer following below rules:
  1. Format of the json {translation: translation of the sentence, words: extracted words}.
  2. Extracted words Json format is an array of format : '{original word: {translation: translation text, kind: kind of word like verb, adjective etc.}}'.
  3. Before extracting words, check if the word is not a verb, an adjective, or a name, if so, extract it by grouping it with the denoted words of it but if not, extract only the word. Output format is : '{extracted a group of words: {translation: translation text, kind: kind of word like verb, adjective etc.}}'.
  4. Your answer must consist of only a single Json and please don't add explanations or summaries.`,
  extract_words: `Extract words and translate them to ${language} language as json format and generate your answer following below rules:
  1. Format of the json {words: extracted words}.
  2. Extracted words Json format is an array of format : '{original word: {translation: its translation, kind: kind of word like verb, adjective etc.}}'.
  3. Before extracting words, check if the word is not a verb, an adjective, or a name, if so, extract it by grouping it with the denoted words of it but if not, extract only the word. Output format is : '{extracted a group of words: {translation: translation text, kind: kind of word like verb, adjective etc.}}'.
  4. Your answer must consist of only a single Json and please don't add explanations or summaries.`,
  summarise_text: `Summarise specified text to ${language} in the same language for ${level} second language learners by using at least 50% of the text. Your answer must include only the summarised text.`,
  simplfy_text: `Simplify grammar of the text in the same language for ${level} second language learners by following the rules:
  - Don't shorten the text.
  - Adds paragraphs with proper HTML tags.
  - Clear links and useless html tags.
  - Clear unrelated and unnecessary content.
  - Don't use html and body tags.
  - Your answer must include only the result text.`,
  translate_text_string: `Translate specified text to ${language}. Your answer must include only the translated text.`,
  translate_text_json: `Translate specified text to ${language} as json format. Your answer must be only a Json format is {"translation": translation of text as string}.`
})