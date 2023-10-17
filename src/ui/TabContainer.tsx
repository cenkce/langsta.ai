import { ComponentType, useState } from "react";

type TabContent = {
  id: string;
  component: ComponentType<any>;
  button: string;
  title: string;
};
type TabContainerProps = { content: TabContent[]; };
export const TabContainer = (props: TabContainerProps) => {
  const [selectedTabId, setSelecteTabId] = useState(props.content[0].id);
  const selectedTab = props.content.find((tab) => tab.id === selectedTabId);
  const TabContent = selectedTab?.component;

  return (
    <div className="w-full min-h-screen">
      <div
        className={`relative grid gap-8 p-7 grid-cols-${props.content.length}`}
      >
        {props.content.map((tab) => {
          return (
            <TabButton
              onClick={(tab) => {
                setSelecteTabId(tab);
              }}
              key={tab.id}
              label={tab.button}
              id={tab.id} />
          );
        })}
      </div>
      <div className="p-5">
        {TabContent ? <TabContent header={selectedTab.title} /> : null}
      </div>
    </div>
  );
};
function TabButton(props: {
  label: string;
  id: string;
  onClick: (tab: string) => void;
}) {
  return (
    <div
      onClick={() => props.onClick(props.id)}
      style={{ cursor: "pointer", userSelect: "none" }}
      className="items-center rounded-sm p-2 bg-stone-200 hover:bg-stone-300 text-stone-500"
    >
      {props.label}
    </div>
  );
}
