import { sanitizeUtmUrl } from "@espoojs/utils";
import { useLocalstorageSync } from "../api/storage/useLocalstorageSync";
import {
  ContentContextAtom,
  ContentStorage,
} from "../domain/content/ContentContext.atom";
import { useCurrentTabData } from "../domain/content/currentTabMessageDispatch";
import { ArtBoard } from "../ui/ArtBoard";
import { TabContainer } from "../ui/TabContainer";
import styles from "./SidepanelApp.module.scss";
import { Translations } from "./Translations";

export const SidepanelApp = () => {
  useLocalstorageSync({
    debugKey: "content-sidepanel",
    storageAtom: ContentContextAtom,
    contentStorage: ContentStorage,
  });

  return (
    <ArtBoard
      title="Translations"
      subtitle="Displaying translations all or by domain, or page url"
      theme="cupcake"
    >
      <div className={styles.container}>
        <TabContainer
          className={"p-0 #important"}
          content={[
            {
              id: "1",
              component: PageTranslations,
              button: "In Page",
              title: "Show translations only from the current page.",
              props: {},
            },
            {
              id: "2",
              component: DomainTranslations,
              button: "In Domain",
              title: "Show translations only from the current domain.",
              props: {},
            },
            {
              id: "3",
              component: Translations,
              button: "All",
              title: "Show translations only from the current domain.",
              props: {},
            },
          ]}
        />
      </div>
    </ArtBoard>
  );
};

const PageTranslations = () => {
  const tabData = useCurrentTabData();
  const tabUrl = tabData.current?.url && sanitizeUtmUrl(new URL(tabData.current?.url || "").toString());
  return (
    <Translations
      onFilter={(task) => {
        return !!tabData.current?.url && !!task.selection.siteName && task.selection.siteName === tabUrl;
      }}
    />
  );
};
const DomainTranslations = () => {
  const tabData = useCurrentTabData();
  const tabUrl = tabData.current?.url && sanitizeUtmUrl(new URL(tabData.current?.url || "").toString());

  return (
    <Translations
      onFilter={(task) => {
        if (tabUrl) {
          const url = new URL(tabUrl || "");
          return (task.selection.siteName?.indexOf(url.host) || -1) > -1;
        }
        return false;
      }}
    />
  );
};
