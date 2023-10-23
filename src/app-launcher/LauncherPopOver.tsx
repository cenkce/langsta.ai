import { LevelsIcon, IconLevelMid, IconLevelHigh } from "../ui/LevelsIcon";
import { PropsWithChildren } from "react";
import { TabContainer } from "../ui/TabContainer";
import { useAtom } from "../api/core/useAtom";
import { SettingsAtom } from "../domain/user/SettingsModel";
import { TargetLanguageLevel } from "../domain/student/TargetLanguageLevel";

export const solutions = [
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
    name: "Upper Intermediate",
    description: "Convert selected text to B2 level",
    level: "B2",
    icon: IconLevelHigh,
  },
] as const;

const Content = (props: PropsWithChildren<{ header: string }>) => {
  return (
    <div>
      <header>{props.header}</header>
      <main>{props.children}</main>
    </div>
  );
};

const LanguageLevelSelect = (props: {
  value: string;
  onChange: (level: TargetLanguageLevel) => void;
}) => {
  return (
    <div className="join">
      {solutions.map(({level}) => {
        return <input
          key={level}
          className="join-item btn"
          type="radio"
          name="level"
          onChange={() => props.onChange(level)}
          checked={props.value === level}
          aria-label={level}
          value={level}
        />
      })}
    </div>
  );
};

export function LauncherPopOver() {
  const [{level}, setSettings] = useAtom(SettingsAtom);
  console.log(level);
  return (
    <div
      className={'min-h-full'}
    >
      <TabContainer
        content={[
          {
            id: "1",
            component: LanguageLevelSelect,
            button: "Level",
            title: "Language Levelt",
            props: { value: level, onChange: (value: TargetLanguageLevel) => {
              setSettings((settings) => ({ ...settings, level: value }));
            }},
          },
          // { id: "2", component: Content, button: "Label", title: "" },
          {
            id: "3",
            component: Content,
            button: "Chat GPT",
            title: "Chat GPT Settings",
            props: {},
          },
        ]}
      />
    </div>
  );
}

