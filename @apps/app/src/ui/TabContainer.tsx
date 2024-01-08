import { ComponentType, useState } from "react";
import styles from "./TabContainer.module.scss";
import { classNames } from "@espoojs/utils";

type TabContent<P extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  component: ComponentType<any>;
  button: string;
  title: string;
  props?: P;
};

type TabContainerProps = { content: TabContent[]; className?: string; };
export const TabContainer = (props: TabContainerProps) => {
  const [selectedTabId, setSelecteTabId] = useState(props.content[0].id);
  const selectedTab = props.content.find((tab) => tab.id === selectedTabId);
  const TabContent = selectedTab?.component;

  return (
    <div className={styles.main}>
      <div className={styles.buttons}>
        {props.content.map((tab) => {
          return (
            <TabButton
              onClick={(tab) => {
                setSelecteTabId(tab);
              }}
              key={tab.id}
              label={tab.button}
              id={tab.id}
              selected={tab.id === selectedTabId}
            />
          );
        })}
      </div>
      <div className={classNames("p-5 min-h-full", props.className)}>
        {TabContent ? (
          <TabContent header={selectedTab.title} {...selectedTab.props} />
        ) : null}
      </div>
    </div>
  );
};
function TabButton(props: {
  label: string;
  id: string;
  onClick: (tab: string) => void;
  selected: boolean;
}) {
  return (
    <div
      onClick={() => props.onClick(props.id)}
      className={[
        styles.button,
        props.selected ? styles["button-active--true"] : "",
      ].join(" ")}
    >
      {props.label}
    </div>
  );
}
