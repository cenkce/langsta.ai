export const TranslatePropmpts = ({nativeLanguage, targetLanguage, level}:{nativeLanguage?: string, targetLanguage: string, level?: string}) => ({
  tranlate_with_words: `Translate specified paragraph to ${targetLanguage} and extract words with translations as json format and generate your answer following below rules:
  - Format of the json {translation: translation of the sentence, words: extracted words}.
  - Extracted words Json format is an array of format : '{original word: {translation: translation text, kind: kind of word like verb, adjective etc.}}'.
  - Before extracting words, check if the word is not a verb, an adjective, or a name, if so, extract it by grouping it with the denoted words of it but if not, extract only the word. Output format is : '{extracted a group of words: {translation: translation text, kind: kind of word like verb, adjective etc.}}'.
  - Your answer must consist of only a single Json and please don't add explanations or summaries.`,
  extract_words: `Your task is to find and extract Study Words by language's level ${level} or higher in the content and translate them to ${nativeLanguage?.toUpperCase()}. I use Study Words for unique unfamiliar, important or unknown words on the content. 
  Follow the rules below to pinpoint words:
  - Extract amount of words as much as you can.
  - Extract words with their translations as the string format of rules below:
    - Extracted words should be this string : word|translation|kind|examples
      - word: original word
      - translation: translation of the word
      - kind: kind of word like verb, adjective etc.
      - examples: example sentences of the word in format of |target language#example sentence in target language|native language#example sentence in translated language|
        - Target and native language like en, tr, de etc.
        - # is a separator between target language and translated language. 
      - Every word must be in the new line.
    - If no word is extracted, leave the line empty.
  - Paginate extracted words. Each page might contain 15 words the most. If user message is more words and there are still more pages, use next page words. Otherwise reply empty.
  - Every word must be unique and not repeated.
  - Translated the words should be detailed and clear.
  - Add at least 2 examples for each words with translations by language lavel ${level} and json attirbute name must be examples.
  - Don't extract special words and numbers like years, programming language names, brands etc.
  - Don't add anything the response except extracted words.`,
  summarise_text: `Summarise specified text in the same language for ${level} second language learners by using at least 50% of the text. Your answer must include only the summarised text.`,
  summarise_text_native: `Summarise specified text by translating ${nativeLanguage} for ${level} second language learners by using at least 50% of the text. Your answer must include only the summarised text.`,
  simplfy_text: `Simplify grammar of the text in the same language for ${level} second language learners by following the rules:
  - Don't shorten the text.
  - Add HTML tags for paragraphs and headers.
  - Clear links and useless html tags.
  - Clear unrelated and unnecessary content.
  - Don't use html and body tags.
  - Your answer must include only the result text.`,
  translate_text_string: `Translate specified text to ${nativeLanguage}. Your answer must include only the translated text.`,
  translate_text_json: `Translate specified text to ${nativeLanguage} as json format. Your answer must be only a Json format is {"translation": translation of text as string}.`,
  systemTeacherMessage: `You are an english teacher, one of your students asks you to help about 
    - Summarising the text, 
    - spotting unfamiliar or unknown words, 
    - simplifying the grammar,
    - translating the text
    etc. by level ${nativeLanguage} ${level}.`
});
