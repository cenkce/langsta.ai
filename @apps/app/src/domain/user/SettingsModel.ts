import { Atom, StoreSubject } from "../../api/core/StoreSubject";
import { LocalStorage } from "../../api/storage/LocalStorage";
import { TargetLanguageLevel } from "../student/TargetLanguageLevel";

export const SettingsAtom = Atom.of(
  { key: "settings" },
  new StoreSubject<{
    settings: SettingsState;
  }>({ settings: {} })
);

export const SettingsStorage = LocalStorage.of('settings');

export type SettingsState = {
  apiKey?: string;
  level?: TargetLanguageLevel;
  targetLanguage?: string;
  nativelanguage?: string;
}