import { useRef } from "react";
import { TranslationContentCard } from "./TranslationContentCard";
import { ImageIcon } from "../ui/icons/ImageIcon";
import { useSubscribeTranslationTask } from "../domain/content/ContentContext.atom";

export type ContentMarkerBadgeType = {
  id: string;
  left: number;
  top: number;
  visible: boolean;
  loading: boolean;
  clicked: boolean;
  text: string;
  taskId?: string
};
type ContentMarkerBadgeProps = ContentMarkerBadgeType & {
  onClose?: (marker: ContentMarkerBadgeType) => void;
  onClick?: (marker: ContentMarkerBadgeType) => void;
  onTranslate?: (marker: ContentMarkerBadgeType) => void;
};

export const ContentMarkerBadge = (props: ContentMarkerBadgeProps) => {
  const markerRef = useRef<HTMLDivElement | null>(null);
  const { onClose, ...badgeData } = props;
  const task = useSubscribeTranslationTask(props.taskId);
  const loading = task?.status === 'progress';

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
          <TranslationContentCard
            onTranslate={() => props.onTranslate?.(badgeData)}
            onClose={() => onClose?.(badgeData)}
            loading={loading}
          >
            <pre style={{whiteSpace: 'break-spaces'}}>{task?.result || props.text}</pre>
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
