import { LocalStorage } from "../../api/storage/LocalStorage";
import { TargetLanguageLevel } from "../student/TargetLanguageLevel";
import { StoreSubject, Atom } from "@espoojs/atom";
import { WordsCollection } from "./WordDescriptor";

export type UserStore = { myWords: WordsCollection };
export const UserStore = new StoreSubject({
  settings: {} as SettingsState,
  user: { myWords: {} } as UserStore,
});
export const UsersAtom = Atom.of({ key: "user" }, UserStore);

export const SettingsAtom = Atom.of({ key: "settings" }, UserStore);

export const UserStorage = LocalStorage.of<UserStore>("user");

export const SettingsStorage = LocalStorage.of<SettingsState>("settings");

export type SettingsState = {
  apiKey?: string;
  level?: TargetLanguageLevel;
  targetLanguage?: string;
  nativelanguage?: string;
};
