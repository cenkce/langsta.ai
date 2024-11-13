import { useAtom } from "@espoojs/atom";
import { SettingsAtom } from "../domain/user/SettingsModel";
import { useEffect, useRef } from "react";
import { useForm } from "@mantine/form";
import { NativeSelect, PasswordInput } from "@mantine/core";
import shallowEqual from "../api/utils/shallowEqual";
import { LanguageLevelSelect } from "./LanguageLevelSelect";
import styles from "./ApiSettingsForm.module.scss";

export const ApiSettingsForm = () => {
  const [settings, setSettings] = useAtom(SettingsAtom);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      apiKey: settings.apiKey,
      nativelanguage: settings.nativelanguage,
      targetLanguage: settings.targetLanguage || "en",
      level: settings.level
    },
    validate: {
      apiKey: (value) => !!value?.trim()?.length,
    },
    onValuesChange: (values) => {
      setSettings(values);
    },
  });
  const formRef = useRef(form);
  formRef.current = form;

  useEffect(() => {
    const subs = SettingsAtom.get$().subscribe((v) => {
      if (
        !shallowEqual(
          {
            apiKey: v.apiKey,
            nativelanguage: v.nativelanguage,
            targetLanguage: v.targetLanguage,
            level: v.level
          },
          formRef.current.getValues(),
        )
      ) {
        form.setValues({
          apiKey: v.apiKey,
          nativelanguage: v.nativelanguage,
          targetLanguage: v.targetLanguage,
          level: v.level,
        });
      }
    });
    return () => {
      subs.unsubscribe();
    };
  }, []);

  return (
    <form className={styles.root}>
      <PasswordInput
        withAsterisk={false}
        label="Enter ChatGPT Api Key"
        placeholder=""
        key={form.key("apiKey")}
        {...form.getInputProps("apiKey")}
      />
      <NativeSelect
        label="Your Native Language"
        key={form.key("nativelanguage")}
        data={[
          { value: "en", label: "English" },
          { value: "fr", label: "French" },
          { value: "de", label: "German" },
          { value: "es", label: "Spanish" },
          { value: "it", label: "Italian" },
          { value: "ja", label: "Japanese" },
          { value: "pt", label: "Portuguese" },
          { value: "ru", label: "Russian" },
          { value: "zh", label: "Chinese" },
          { value: "ar", label: "Arabic" },
          { value: "fa", label: "Persian" },
          { value: "tr", label: "Turkish" },
        ]}
        {...form.getInputProps("nativelanguage")}
      />
      <NativeSelect
        label="Your Target Language"
        key={form.key("targetLanguage")}
        data={[
          { value: "", label: "Select" },
          { value: "en", label: "English" },
        ]}
        {...form.getInputProps("targetLanguage")}
      />

      <LanguageLevelSelect header="Current Level" {...form.getInputProps("level")}></LanguageLevelSelect>
    </form>
  );
};

