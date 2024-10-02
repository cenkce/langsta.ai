import { LocalStorage } from "../../api/storage/LocalStorage";
import { TargetLanguageLevel } from "../student/TargetLanguageLevel";
import { Atom } from "@espoojs/atom";
import { UserStore } from "./UserModel";

export const SettingsAtom = Atom.of({ key: "settings" }, UserStore);

export const SettingsStorage = LocalStorage.of<SettingsState>("settings");

export type SettingsState = {
  apiKey?: string;
  level?: TargetLanguageLevel;
  targetLanguage?: string;
  nativelanguage?: string;
};
