import { useAtom } from "@espoojs/atom";
import { UsersAtom } from "../../domain/user/SettingsModel";
import FlashCardQueue, { FlashCardData } from "../../ui/flashcardslist/FlashCardQueue";

export const FlashCardsView = () => {
  const [state] = useAtom(UsersAtom);
  return (
    <FlashCardQueue data={Object.entries(state.myWords).map(([word, item]) => {
      return {
        description: '',
        image: '',
        word: word,
        examples: [],
        translation: item.translation,
      } as FlashCardData
    })} />
  );
}