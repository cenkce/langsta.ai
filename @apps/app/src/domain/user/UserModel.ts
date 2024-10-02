import { StoreSubject, Atom } from "@espoojs/atom";
import { LocalStorage } from "../../api/storage/LocalStorage";
import { SettingsState } from "./SettingsModel";
import { WordsCollection } from "./WordDescriptor";


export type UserStore = { myWords: WordsCollection; };
export const UserStore = new StoreSubject({
  settings: {} as SettingsState,
  user: { myWords: {} } as UserStore,
});
export const UsersAtom = Atom.of({ key: "user" }, UserStore);
export const UserStorage = LocalStorage.of<UserStore>("user");
