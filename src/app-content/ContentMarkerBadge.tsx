import { useEffect, useRef } from "react";
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
  taskId?: string;
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
  const loading = task?.status === "progress";
  useEffect(() => {
    if (markerRef.current) {
      const handler = () => {
        if (markerRef.current) {
          const bodyRect = document.body.getBoundingClientRect();
          const ownRect = markerRef.current?.getBoundingClientRect();
          const ww = ownRect?.width || 0;
          markerRef.current.style.left =
            Math.max(Math.min(props.left - ww / 2, bodyRect.right - ww), 0) +
            "px";
          markerRef.current.style.top =
            Math.max(props.top - (ownRect?.height || 0), window.scrollY) + "px";
        }
      };
      const observer = new MutationObserver(handler);
      handler();

      observer.observe(markerRef.current, {
        attributes: false,
        childList: true,
        subtree: false,
      });

      return () => observer.disconnect();
    }
  }, []);

  return (
    <div
      className={"ContentMarkerBadge "}
      style={{
        zIndex: Number.MAX_SAFE_INTEGER,
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
          <pre style={{ whiteSpace: "break-spaces" }}>
            {task?.result || props.text}
          </pre>
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
  );
};
