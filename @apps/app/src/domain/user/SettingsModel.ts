import { LocalStorage } from "../../api/storage/LocalStorage";
import { TargetLanguageLevel } from "../student/TargetLanguageLevel";
import { StoreSubject, Atom} from "@espoojs/atom";

export const SettingsAtom = Atom.of(
  { key: "settings" },
  new StoreSubject({ settings: {} as SettingsState })
);

export const SettingsStorage = LocalStorage.of<SettingsState>('settings');

export type SettingsState = {
  apiKey?: string;
  level?: TargetLanguageLevel;
  targetLanguage?: string;
  nativelanguage?: string;
}