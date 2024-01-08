import {
  useUserContentSetState,
  useUserContentState,
} from "../domain/content/ContentContext.atom";
import {
  ContentMarkerBadge,
  ContentMarkerBadgeType,
} from "./ContentMarkerBadge";
import { useEffect, useRef, useState } from "react";
import {
  getSelectedText,
  getSelectedTextSelectors,
} from "../domain/utils/getSelectedText";
import { TabMessages } from "../domain/content/currentTabMessageDispatch";
import { useTranslateService } from "../domain/translation/TranslationService";
import { serviceWorkerContentMessageDispatch } from "../domain/content/messages";
import { createContentSelection } from "../domain/utils/createContentSelection";
import {
  sanitizeUtmUrl,
  useGlobalMouseEventHandlerService,
} from "@espoojs/utils";
export const ContentCaptureContainer = () => {
  const setUserContent = useUserContentSetState();
  const [markers, setMarkers] = useState<ContentMarkerBadgeType[]>([]);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [selection] = useUserContentState();
  const { translate } = useTranslateService();

  // const [content] = useAtom(ContentContextAtom);
  // selectedText.
  // useEffect(() => {
  //   if (content.selectedText?.text.trim() && content.selectedText.selectors) {
  //     // const [anchor, focus] = content.selectedText.selectors;
  //     // setSelectedText(anchor, focus);
  //   }
  // }, [content.selectedText?.text]);

  // TODO: Add support for multiple mouse events
  useGlobalMouseEventHandlerService({
    excludeTargetClassNames: ["ContentMarkerBadge"],
    rootRef,
    onOutsideClick: (e: MouseEvent) => {
      const selectedText = getSelectedText().trim();
      if (getSelectedText().trim().length > 0) {
        setUserContent((state) => ({
          ...state,
          selectedText: {
            text: selectedText,
            selectors: getSelectedTextSelectors(),
            siteName: sanitizeUtmUrl(window.location.href),
          },
        }));
        setMarkers((markers) => [
          ...markers,
          {
            id: Date.now().toString(),
            left: e.pageX,
            top: e.pageY,
            visible: true,
            loading: false,
            clicked: false,
            text: selectedText,
          },
        ]);
      } else {
        setMarkers([]);
      }
    },
  });
  useGlobalMouseEventHandlerService({
    excludeTargetClassNames: ["ContentMarkerBadge"],
    rootRef,
    type: "mousedown",
    onOutsideClick: () => {
      setMarkers([]);
    },
  });

  useEffect(() => {
    const scrollToTarget = (element: HTMLElement) => {
      if (!element) {
        throw new Error("Traget element not found");
      }

      element.scrollIntoView({ inline: "center" });
    };
    const messageHandler = (message: TabMessages) => {
      if (message.type === "select-content") {
        if (message.task.selection.selectors) {
          try {
            const [anchorElement] = createContentSelection(
              message.task.selection.selectors,
            );
            scrollToTarget(anchorElement);

            setMarkers(() => {
              return [
                {
                  // TODO: Only get taskid from message and find the task in content app and use it instead.
                  text: message.task.result || message.task.selection.text,
                  taskId: message.task.taskId,
                  id: message.task.taskId || Date.now().toString(),
                  left: 0,
                  top: 0,
                  visible: true,
                  loading: false,
                  clicked: false,
                },
              ];
            });
          } catch (error) {
            console.error(error);
          }
        } else
          setMarkers((markers) => {
            return [
              ...markers,
              {
                // TODO: Only get taskid from message and find the task in content app and use it instead.
                text: message.task.result || message.task.selection.text,
                taskId: message.task.taskId,
                id: message.task.taskId || Date.now().toString(),
                left: 0,
                top: 0,
                visible: true,
                loading: false,
                clicked: false,
              },
            ];
          });
      }
    };
    chrome.runtime.onMessage.addListener(messageHandler);

    return () => {
      chrome.runtime.onMessage.removeListener(messageHandler);
    };
  }, []);

  return (
    <div ref={rootRef} className={"content-app-root"} data-theme={"cupcake"}>
      {markers
        .filter((marker) => marker.visible)
        .map((marker, i) => {
          return (
            <ContentMarkerBadge
              key={marker.id}
              onAction={(data, action) => {
                if (action === "sidebar") {
                  serviceWorkerContentMessageDispatch({
                    type: "open-side-panel",
                  });
                  return;
                }
                const taskId =
                  selection.selectedText && translate(selection.selectedText);
                if (!taskId) return;
                const newMarkers = [...markers];
                newMarkers[i] = {
                  ...data,
                  taskId,
                  action,
                };
                setMarkers(newMarkers);
              }}
              {...marker}
              onClick={(ev) => {
                setMarkers((state) =>
                  state.map((marker) =>
                    ev.id === marker.id ? { ...marker, clicked: true } : marker,
                  ),
                );
              }}
              onClose={(ev) => {
                setMarkers((state) =>
                  state.filter((marker) => ev.id !== marker.id),
                );
              }}
              // onClick={() => translate(marker.selectedText)}
            />
          );
        })}
    </div>
  );
};
