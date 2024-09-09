import { ComponentType } from "react";
import { Tabs } from "@mantine/core";

type TabContent<P extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  component: ComponentType<{ header?: string }>;
  button: string;
  title: string;
  props?: P;
};

type TabContainerProps = { content: TabContent[]; className?: string };
export const TabContainer = (props: TabContainerProps) => {
  return (
    <Tabs defaultValue="settings" orientation="vertical">
      <Tabs.List>
        {props.content.map((tab) => {
          return (
            <Tabs.Tab key={tab.id} value={tab.id}>
              {tab.title}
            </Tabs.Tab>
          );
        })}
      </Tabs.List>
      {props.content.map((tab) => {
        return (
          <Tabs.Panel key={tab.id} value={tab.id}>
            <tab.component header={tab.title} />
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );
};
