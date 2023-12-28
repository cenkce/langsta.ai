import { useAtom } from "@streamium/atom";
import shallowEqual from "../api/utils/shallowEqual";
import { SettingsAtom, SettingsState } from "../domain/user/SettingsModel";
import { ReactNode, useEffect, useRef, useState } from "react";

export const ApiSettingsForm = () => {
  const [settings, setSettings] = useAtom(SettingsAtom);
  const [saved, setSaved] = useState<undefined | boolean>();
  const settingsRef = useRef<SettingsState | null | undefined>(null);

  useEffect(() => {
    if (settingsRef.current === null) {
      settingsRef.current = settings;
    } else if (!shallowEqual(settingsRef.current, settings)) {
      const timeout = setTimeout(() => {
        setSaved(true);
        settingsRef.current = settings;
      }, 500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [saved]);

  return (
    <div className="form-control">
      <FormInput
        onChange={(value) => {
          setSaved(false);
          setSettings({ apiKey: value });
        }}
        value={settings.apiKey}
        autoHide={true}
        topLabel="Enter ChatGPT Api Key"
        bottomLabel={
          <span className="label-text label-text-alt">
            If you haven't had an api-key yet, please subscribe ChatGTP and get
            an api-key.{" "}
            <a
              href="https://chat.openai.com/auth/login"
              className="link link-hover"
              target="_blank"
            >
              Click to Subcribe
            </a>
          </span>
        }
      />
      <FormSelect
        topLabel="Your Native Language"
        value={settings.nativelanguage}
        onChange={(value) => {
          setSaved(false);
          setSettings({ nativelanguage: value });
        }}
      >
        <option>Select Language</option>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="es">Spanish</option>
        <option value="it">Italian</option>
        <option value="ja">Japanese</option>
        <option value="pt">Portuguese</option>
        <option value="ru">Russian</option>
        <option value="zh">Chinese</option>
        <option value="ar">Arabic</option>
        <option value="fa">Persian</option>
        <option value="tr">Turkish</option>
      </FormSelect>
      <FormSelect
        topLabel="Your Target Language"
        value={settings.targetLanguage}
        onChange={(value) => {
          setSaved(false);
          setSettings({ targetLanguage: value });
        }}
      >
        <option>Select Language</option>
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="es">Spanish</option>
        <option value="it">Italian</option>
        <option value="ja">Japanese</option>
        <option value="pt">Portuguese</option>
        <option value="tr">Turkish</option>
      </FormSelect>
      {saved !== undefined && (
        <div
          className={`alert ${
            saved ? "alert-success" : "alert-warning"
          } h-9 px-2 content-center w-min mt-4`}
        >
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
          <span>{saved ? "Saved" : "Saving"}</span>
        </div>
      )}
    </div>
  );
};

const FormInput = (props: {
  onChange: (value: string) => void;
  value?: string;
  bottomLabel?: string | ReactNode;
  topLabel?: string | ReactNode;
  autoHide?: boolean;
}) => {
  return (
    <div>
      <label className="label">
        <span className="label-text font-bold">{props.topLabel}</span>
      </label>
      <input
        className="input input-bordered input-sm w-full"
        placeholder="Api Key"
        value={props.value}
        onFocus={(e) => {
          e.target.type = "text";
        }}
        onBlur={(e) => {
          if (props.autoHide) e.target.type = "password";
        }}
        type="password"
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
      />
      {props.bottomLabel && (
        <label className="label">{props.bottomLabel}</label>
      )}
    </div>
  );
};

const FormSelect = (props: {
  children:
    | React.ReactElement<HTMLOptionElement, "option">
    | React.ReactElement<HTMLOptionElement, "option">[];
  onChange: (value: string) => void;
  value?: string;
  bottomLabel?: string | ReactNode;
  topLabel?: string | ReactNode;
  autoHide?: boolean;
}) => {
  return (
    <div>
      <label className="label">
        <span className="label-text font-bold">{props.topLabel}</span>
      </label>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="select select-bordered select-sm  w-full"
      >
        {props.children}
      </select>
      {props.bottomLabel && (
        <label className="label">{props.bottomLabel}</label>
      )}
    </div>
  );
};
