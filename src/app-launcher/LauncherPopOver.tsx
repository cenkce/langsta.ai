import { LevelsIcon, IconLevelMid, IconLevelHigh } from "../ui/LevelsIcon";
import { TargetLanguageLevel } from "../domain/student/TargetLanguageLevel";
import { PropsWithChildren } from "react";
import { TabContainer } from "../ui/TabContainer";

const solutions = [
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

const LanguageLevelContent = () => {
  return solutions.map((item) => (
    <div
      style={{ cursor: "pointer", userSelect: "none" }}
      key={item.name}
      // onClick={() => props.onClick(item.level)}
      className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
        <item.icon aria-hidden="true" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500">{item.description}</p>
      </div>
    </div>
  ));
};

export function LauncherPopOver(props: {
  onClick: (level: TargetLanguageLevel) => void;
}) {
  console.log(props, solutions);
  return (
    <div
      className={[
        "min-h-full",
        "min-w-full",
        "overflow-hidden",
        "rounded-lg",
        "shadow-lg",
        "ring-1",
        "ring-black",
        "ring-opacity-5",
        "dark:bg-zinc-700",
      ].join(" ")}
    >
      <TabContainer
        content={[
          {
            id: "1",
            component: LanguageLevelContent,
            button: "Level",
            title: "Language Levelt",
          },
          { id: "2", component: Content, button: "Label", title: "" },
          {
            id: "3",
            component: Content,
            button: "Chat GPT",
            title: "Chat GPT Settings",
          },
        ]}
      ></TabContainer>
      {/* <div className="relative grid gap-8 p-7 grid-cols-4">
        <div
          style={{ cursor: "pointer", userSelect: "none" }}
          className="items-center rounded-sm p-2 bg-stone-300 text-stone-500"
        >
          Button
        </div> */}

      {/* {solutions.map((item) => (
          <div
            style={{ cursor: "pointer", userSelect: "none" }}
            key={item.name}
            onClick={() => props.onClick(item.level)}
            className="flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white sm:h-12 sm:w-12">
              <item.icon aria-hidden="true" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
          </div>
        ))} */}
      {/* </div> */}
      {/* <div className="bg-gray-50 p-4">
          <a
            href="##"
            className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
          >
            <span className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                Documentation
              </span>
            </span>
            <span className="block text-sm text-gray-500">
              Start integrating products and tools
            </span>
          </a>
        </div> */}
    </div>
  );
}

