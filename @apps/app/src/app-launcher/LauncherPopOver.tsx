import { TabContainer } from "../ui/TabContainer";
import { SettingsAtom } from "../domain/user/SettingsModel";
import { TargetLanguageLevel } from "../domain/student/TargetLanguageLevel";
import { ApiSettingsForm } from "./ApiSettingsForm";
import { useAtom } from "@espoojs/atom";
import { SegmentedControl, Title } from "@mantine/core";

export const solutions = [
  {
    name: "Elementary",
    description: "Convert selected text to A2 level",
    label: "A1",
    value: "A1",
  },
  {
    name: "Elementary",
    description: "Convert selected text to A2 level",
    label: "A2",
    value: "A2",
  },
  {
    name: "Intermediate",
    description: "Convert selected text to B1 level",
    label: "B1",
    value: "B1",
  },
  {
    name: "Intermediate",
    description: "Convert selected text to B1 level",
    label: "B2",
    value: "B2",
  },
  {
    name: "Upper Intermediate",
    description: "Convert selected text to B2 level",
    label: "C1",
    value: "C1",
  },
];

const LanguageLevelSelect = (props: {
  header?: string;
  value?: string;
  onChange?: (level: TargetLanguageLevel) => void;
}) => {
  return (
    <>
      <Title order={4} className="text-center">
        {props.header}
      </Title>
      <div className="join">
        <SegmentedControl
          value={props.value}
          data={solutions}
          onChange={(d) => props.onChange?.(d as TargetLanguageLevel)}
        />
      </div>
    </>
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
          },
        ]}
      />
    </div>
  );
}
