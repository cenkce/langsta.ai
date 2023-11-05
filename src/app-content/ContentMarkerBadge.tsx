import { useRef } from "react";
import { TranslationContentCard } from "./TranslationContentCard";

export type ContentMarkerBadgeType = {
  id: string;
  left: number;
  top: number;
  visible: boolean;
  loading: boolean;
  clicked: boolean;
  selectedText: string;
};
type ContentMarkerBadgeProps = ContentMarkerBadgeType & {
  onClose?: (marker: ContentMarkerBadgeType) => void;
};

export const ContentMarkerBadge = (props: ContentMarkerBadgeProps) => {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const {  onClose, ...badgeData } = props;
  return (
    <>
      <div
        className={"ContentMarkerBadge"}
        style={{
          zIndex: Number.MAX_SAFE_INTEGER,
          left: props.left,
          top: props.top,
        }}
        ref={markerRef}
      >
        <TranslationContentCard onClose={() => onClose?.(badgeData)}>
          <div>{props.selectedText}</div>
        </TranslationContentCard>
      </div>
    </>
  );
};
