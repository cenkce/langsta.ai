import { LevelsIcon, IconLevelMid, IconLevelHigh } from "../ui/LevelsIcon";
import { TabContainer } from "../ui/TabContainer";
import { useAtom } from "../api/core/useAtom";
import { SettingsAtom } from "../domain/user/SettingsModel";
import { TargetLanguageLevel } from "../domain/student/TargetLanguageLevel";
import { ApiSettingsForm } from "./ApiSettingsForm";

export const solutions = [
  {
    name: "Elementary",
    description: "Convert selected text to A2 level",
    level: "A1",
    icon: LevelsIcon,
  },
  {
    name: "Elementary",
    description: "Convert selected text to A2 level",
    level: "A2",
    icon: LevelsIcon,
  },
  {
    name: "Intermediate",
    description: "Convert selected text to B1 level",
    level: "B1",
    icon: IconLevelMid,
  },
  {
    name: "Intermediate",
    description: "Convert selected text to B1 level",
    level: "B2",
    icon: IconLevelMid,
  },
  {
    name: "Upper Intermediate",
    description: "Convert selected text to B2 level",
    level: "C1",
    icon: IconLevelHigh,
  },
] as const;

const LanguageLevelSelect = (props: {
  value: string;
  onChange: (level: TargetLanguageLevel) => void;
}) => {
  return (
    <div className="join">
      {solutions.map(({ level }) => {
        return (
          <input
            key={level}
            className="join-item btn"
            type="radio"
            name="level"
            onChange={() => props.onChange(level)}
            checked={props.value === level}
            aria-label={level}
            value={level}
          />
        );
      })}
    </div>
  );
};

export function LauncherPopOver() {
  const [{ level }, setSettings] = useAtom(SettingsAtom);

  return (
    <div className={"min-w-full h-auto"}>
      <TabContainer
        content={[
          {
            id: "3",
            component: ApiSettingsForm,
            button: "Chat GPT",
            title: "Chat GPT Settings",
            props: {},
          },
          {
            id: "1",
            component: LanguageLevelSelect,
            button: "Level",
            title: "Language Levelt",
            props: {
              value: level,
              onChange: (value: TargetLanguageLevel) => {
                setSettings((settings) => ({ ...settings, level: value }));
              },
            },
          }
        ]}
      />
    </div>
  );
}
