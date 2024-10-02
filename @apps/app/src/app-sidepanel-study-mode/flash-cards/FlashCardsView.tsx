import { useAtom } from "@espoojs/atom";
import { UsersAtom } from "../../domain/user/UserModel";
// import FlashCardQueue from "../../ui/flashcardslist/FlashCardQueue";
import { FlashCardData } from '../../ui/flashcardslist/FlashCardData';
import Crosswords from "../../ui/crosswords/Crosswords";

export const FlashCardsView = () => {
  const [state] = useAtom(UsersAtom);
  return (
    <Crosswords flashCardData={Object.entries(state.myWords).map(([word, item]) => {
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

