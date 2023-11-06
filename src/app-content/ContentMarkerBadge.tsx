import { useRef } from "react";
import { TranslationContentCard } from "./TranslationContentCard";
import { ImageIcon } from "../ui/icons/ImageIcon";

export type ContentMarkerBadgeType = {
  id: string;
  left: number;
  top: number;
  visible: boolean;
  loading: boolean;
  clicked: boolean;
  text: string;
};
type ContentMarkerBadgeProps = ContentMarkerBadgeType & {
  onClose?: (marker: ContentMarkerBadgeType) => void;
  onClick?: (marker: ContentMarkerBadgeType) => void;
};

export const ContentMarkerBadge = (props: ContentMarkerBadgeProps) => {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const { onClose, ...badgeData } = props;
  return (
    <>
      <div
        className={"ContentMarkerBadge "}
        style={{
          zIndex: Number.MAX_SAFE_INTEGER,
          left: props.left,
          top: props.top,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        ref={markerRef}
      >
        {props.clicked ? (
          <TranslationContentCard onClose={() => onClose?.(badgeData)}>
            <div>{props.text}</div>
          </TranslationContentCard>
        ) : (
          <ImageIcon
            onClick={(e) => {
              e.stopPropagation();
              props.onClick?.(badgeData);
            }}
            iconUrl="logo.png"
          />
        )}
      </div>
    </>
  );
};
