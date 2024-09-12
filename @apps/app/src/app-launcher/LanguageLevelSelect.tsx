import { SegmentedControl, InputLabel } from "@mantine/core";
import { TargetLanguageLevel } from "../domain/student/TargetLanguageLevel";
import { SyntheticEvent } from "react";

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


export const LanguageLevelSelect = (props: {
  header?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (level: TargetLanguageLevel) => void;
  onFocus?: (e: SyntheticEvent) => void;
  onBlur?: (e: SyntheticEvent) => void;
}) => {
  return (
    <div>
      <InputLabel className="text-center">
        {props.header}
      </InputLabel>
      <div className="join">
        <SegmentedControl
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          value={props.defaultValue}
          defaultValue={props.defaultValue}
          data={solutions}
          onChange={(d) => props.onChange?.(d as TargetLanguageLevel)} />
      </div>
    </div>
  );
};
