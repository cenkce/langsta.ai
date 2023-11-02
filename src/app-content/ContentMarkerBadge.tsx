import { useRef } from "react";
import logoUrl from "../assets/logo.png";
import { ImageIcon } from "../ui/icons/ImageIcon";
import { TranslationPopover } from "./TranslationPopover";

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
  onClick: (marker: ContentMarkerBadgeType) => void;
};

export const ContentMarkerBadge = (props: ContentMarkerBadgeProps) => {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const { onClick, ...badgeData } = props;
  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick(badgeData);
          // ContentMessageDispatch({
          //   type: "define-selected-text",
          // });
          // translate();
          // hideMarker();
        }}
        className={'ContentMarkerBadge'}
        style={{
          zIndex: Number.MAX_SAFE_INTEGER,
          left: props.left,
          top: props.top,
        }}
        ref={markerRef}
      >
        <TranslationPopover>
          <div>{props.selectedText}</div>
        </TranslationPopover>
        <ImageIcon iconUrl={logoUrl} />
      </div>
    </>
  );
};
