import { useUserContentState } from "../domain/content/ContentContext.atom";
import { FlexRow } from "../ui/FlexRow";
import { Loading } from "../ui/icons/Loading";
import { useBackgroundTaskSubscription } from "../task/useBackgroundTaskSubscription";

export const SidepanelApp = () => {
  const [userContent] = useUserContentState();
  const status = useBackgroundTaskSubscription("translate-service");

  return (
    <div>
      <h2>Learn Smarter</h2>
      <p id="definition-text">{userContent?.selectedText}</p>
      <p id="definition-text-tranlation">
        {status === "progress" ? (
          <FlexRow>
            <Loading />
            translating ...
          </FlexRow>
        ) : (
          userContent?.translation?.translation
        )}
      </p>
    </div>
  );
};
