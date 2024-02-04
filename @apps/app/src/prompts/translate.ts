export const TranslatePropmpts = ({nativeLanguage, targetLanguage, level}:{nativeLanguage?: string, targetLanguage: string, level?: string}) => ({
  tranlate_with_words: `Translate specified paragraph to ${targetLanguage} and extract words with translations as json format and generate your answer following below rules:
  - Format of the json {translation: translation of the sentence, words: extracted words}.
  - Extracted words Json format is an array of format : '{original word: {translation: translation text, kind: kind of word like verb, adjective etc.}}'.
  - Before extracting words, check if the word is not a verb, an adjective, or a name, if so, extract it by grouping it with the denoted words of it but if not, extract only the word. Output format is : '{extracted a group of words: {translation: translation text, kind: kind of word like verb, adjective etc.}}'.
  - Your answer must consist of only a single Json and please don't add explanations or summaries.`,
  extract_words: `You are an english teacher, one of your students asks you to spot unfamiliar or unknown maximum 25 words, which they will be used the most in daily life, maximum for B2 language learners. Your task is to uniquely extract unfamiliar or unknown words from the text and translate them to ${nativeLanguage} by students language's level. Follow the rules below to pinpoint words:
  - Extract words with their translations as json format : {words: Extracted Words}.
  - Extracted words' Json format is an array of format : '{original word: {translation: its translation, kind: kind of word like verb, adjective etc.}}'.
  - Every word must be unique and not repeated.
  - Your answer must consist of only a single Json without any other texts.
  - Don't extract special words and numbers like years, programming language names, brands etc.`,
  summarise_text: `Summarise specified text in the same language for ${level} second language learners by using at least 50% of the text. Your answer must include only the summarised text.`,
  summarise_text_native: `Summarise specified text by translating ${nativeLanguage} for ${level} second language learners by using at least 50% of the text. Your answer must include only the summarised text.`,
  simplfy_text: `Simplify grammar of the text in the same language for ${level} second language learners by following the rules:
  - Don't shorten the text.
  - Adds paragraphs with proper HTML tags.
  - Clear links and useless html tags.
  - Clear unrelated and unnecessary content.
  - Don't use html and body tags.
  - Your answer must include only the result text.`,
  translate_text_string: `Translate specified text to ${nativeLanguage}. Your answer must include only the translated text.`,
  translate_text_json: `Translate specified text to ${nativeLanguage} as json format. Your answer must be only a Json format is {"translation": translation of text as string}.`
})