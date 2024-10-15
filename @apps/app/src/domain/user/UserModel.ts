import { StoreSubject, Atom } from "@espoojs/atom";
import { LocalStorage } from "../../api/storage/LocalStorage";
import { SettingsState } from "./SettingsModel";
import { WordsCollection } from "./WordDescriptor";

/**
 * UserStore is a store that holds the user's data.
 * @var myWords holds the user's words by url.
 * @var learnedWords holds the user's learned words by url.
 */
export type UserStore = {
  myWords?: Record<string, WordsCollection>;
  learnedWords?: Record<string, string[]>;
};
export const UserStore = new StoreSubject({
  settings: {} as SettingsState,
  user: { myWords: {}, learnedWords: {} } as UserStore,
});
export const UsersAtom = Atom.of({ key: "user" }, UserStore);
export const UserStorage = LocalStorage.of<UserStore>("user");
