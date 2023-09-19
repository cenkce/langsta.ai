import { useUserContentValue } from "../domain/content/ContentContext.atom"
import { ContentNavigationMarker } from "./ContentNavigationMarker"

export const ContentApp = () => {
  const content = useUserContentValue();
  console.log('content app : ', content);
  return <ContentNavigationMarker/>
}