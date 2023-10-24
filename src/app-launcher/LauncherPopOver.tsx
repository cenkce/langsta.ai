import { LevelsIcon, IconLevelMid, IconLevelHigh } from "../ui/LevelsIcon";
import { TabContainer } from "../ui/TabContainer";
import { useAtom } from "../api/core/useAtom";
import { SettingsAtom } from "../domain/user/SettingsModel";
import { TargetLanguageLevel } from "../domain/student/TargetLanguageLevel";
import { useEffect, useRef, useState } from "react";

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

const ApiSettingsForm = () => {
  const [settings, setSettings] = useAtom(SettingsAtom);
  const [saved, setSaved] = useState<undefined | boolean>();
  const settingsRef = useRef<string | null | undefined>(null);
  const apiKey = settings.apiKey;

  useEffect(() => {
    if(settingsRef.current === null) {
      settingsRef.current = apiKey;
    } else if (settingsRef.current !== apiKey) {
      const timeout = setTimeout(() => {
        setSaved(true);
      }, 1000);
      settingsRef.current = apiKey;
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [apiKey]);

  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">Enter ChatGPT Api Key</span>
      </label>
      <input
        className="input input-bordered "
        placeholder="Api Key"
        value={settings.apiKey}
        onFocus={(e) => {
          e.target.type = "text";
        }}
        onBlur={(e) => {
          e.target.type = "password";
        }}
        type="password"
        onChange={(e) => {
          setSaved(false);
          setSettings({ apiKey: e.target.value });
        }}
      />
      <label className="label">
        <span className="label-text label-text-alt">
          If you haven't had an api-key yet, please subscribe ChatGTP and get an
          api-key.{" "}
          <a
            href="https://chat.openai.com/auth/login"
            className="link link-hover"
            target="_blank"
          >
            Click to Subcribe
          </a>
        </span>
      </label>
        {saved !== undefined && (
          <div className={`alert ${saved ? 'alert-success' : 'alert-warning' } h-9 px-2 content-center w-min`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{saved ? 'Saved' : 'Saving'}</span>
          </div>
        )}
    </div>
  );
};

export function LauncherPopOver() {
  const [{ level }, setSettings] = useAtom(SettingsAtom);

  return (
    <div className={"min-h-full"}>
      <TabContainer
        content={[
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
          // { id: "2", component: Content, button: "Label", title: "" },
          {
            id: "3",
            component: ApiSettingsForm,
            button: "Chat GPT",
            title: "Chat GPT Settings",
            props: {},
          },
        ]}
      />
    </div>
  );
}
