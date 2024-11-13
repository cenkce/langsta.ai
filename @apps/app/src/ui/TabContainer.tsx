import { Tabs, TabsProps } from "@mantine/core";
import styles from "./TabContainer.module.scss";
import { FC, useState } from "react";

type TabContent<
  C extends FC<any> = FC<any>,
  P extends { [key: string]: any } = C extends FC<infer P> ? P : any,
> = {
  id: string;
  component: C;
  button: string;
  title: string;
  props?: P;
};

type TabContents<C extends FC<any> = FC<any>> = TabContent<C>[];

type TabContainerProps = {
  className?: string;
};

export const TabContainer: <C extends FC<any> = FC<any>>(
  props: TabContainerProps & { tabs: TabContents<C> } & TabsProps,
) => JSX.Element = (props) => {
  const { tabs, ...tabProps } = props;
  const [activeTab, setActiveTab] = useState<string | null>(tabs[0]?.id);
  
  return (
    <Tabs
      defaultValue={tabs[0]?.id}
      value={activeTab}
      orientation="vertical"
      {...tabProps}
      onChange={(value) => {
        setActiveTab(value);
      }}
    >
      <Tabs.List>
        {props.tabs.map((tab) => {
          return (
            <Tabs.Tab key={tab.id} value={tab.id}>
              {tab.title}
            </Tabs.Tab>
          );
        })}
      </Tabs.List>
      {tabs.map((tab) => {
        const Component: FC = tab.component;
        return (
          <Tabs.Panel key={tab.id} value={tab.id} className={styles.content}>
            <Component {...(tab.props || {})} />
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );
};
