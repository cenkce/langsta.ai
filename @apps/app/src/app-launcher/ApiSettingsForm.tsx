import { useAtom } from "@espoojs/atom";
import { SettingsAtom } from "../domain/user/SettingsModel";
import { useEffect, useRef } from "react";
import { useForm } from "@mantine/form";
import { NativeSelect, TextInput } from "@mantine/core";
import shallowEqual from "../api/utils/shallowEqual";

export const ApiSettingsForm = () => {
  const [settings, setSettings] = useAtom(SettingsAtom);
  // const [saved, setSaved] = useState<undefined | boolean>();
  // const settingsRef = useRef<SettingsState | null | undefined>(null);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      apiKey: settings.apiKey,
      nativelanguage: settings.nativelanguage,
    },
    validate: {
      apiKey: (value) => !!value?.trim()?.length,
    },
    onValuesChange: (values) => {
      console.log("values", values);
      setSettings(values);
    },
  });
  const formRef = useRef(form);
  formRef.current = form;
  useEffect(() => {
    const subs = SettingsAtom.get$().subscribe((v) => {
      if (
        !shallowEqual(
          { apiKey: v.apiKey, nativelanguage: v.nativelanguage },
          formRef.current.getValues(),
        )
      ) {
        console.log(v, formRef.current.getValues());
        form.setValues({
          apiKey: v.apiKey,
          nativelanguage: v.nativelanguage,
        });
      }
    });
    return () => {
      subs.unsubscribe();
    };
  }, []);

  // useEffect(() => {
  //   if (settingsRef.current === null) {
  //     settingsRef.current = settings;
  //   } else if (!shallowEqual(settingsRef.current, settings)) {
  //     const timeout = setTimeout(() => {
  //       setSaved(true);
  //       settingsRef.current = settings;
  //     }, 500);
  //     return () => {
  //       clearTimeout(timeout);
  //     };
  //   }
  // }, [saved]);

  return (
    <form>
      <TextInput
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

      {/* {saved !== undefined && (
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
      )} */}
    </form>
  );
};
