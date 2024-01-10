import { useEffect, useRef } from "react";
export function checkMousePointerInElement(
  mouseX: number,
  mouseY: number,
  positionRect: DOMRect
) {
  return (
    positionRect.left <= mouseX &&
    mouseX <= positionRect.left + positionRect.width &&
    positionRect.top <= mouseY &&
    mouseY <= positionRect.top + positionRect.height
  );
}

export function useGlobalMouseEventHandlerService({
  excludeTargetClassNames,
  rootRef,
  onOutsideClick,
  type = "click",
}: {
  excludeTargetClassNames: string[] | null;
  rootRef?: React.MutableRefObject<HTMLElement | null>;
  onOutsideClick: ((e: MouseEvent) => void) | null;
  type?: "click" | "mousedown";
}) {
  const onOutsideClickRef = useRef(onOutsideClick);
  onOutsideClickRef.current = onOutsideClick;
  const excludeTargetClassNamesRef = useRef(excludeTargetClassNames);
  excludeTargetClassNamesRef.current = excludeTargetClassNames;

  useEffect(() => {
    if (onOutsideClickRef.current === null) return;
    const clickHandler = (e: MouseEvent) => {
      if (
        (rootRef?.current &&
          ((e.clientX < 0 && e.clientY < 0) ||
            ((e as any).layerX < 0 && (e as any).layerY < 0) ||
            ((e.target as HTMLElement) || { tagName: "" }).tagName ===
              "OPTION" ||
            ((e.target as HTMLElement) || { tagName: "" }).tagName ===
              "SELECT" ||
            (((e.target as HTMLElement) || { tagName: "" }).tagName ===
              "INPUT" &&
              (e.target as any).FileList) ||
            checkMousePointerInElement(
              e.clientX,
              e.clientY,
              rootRef.current.getBoundingClientRect()
            ))) ||
        (excludeTargetClassNamesRef.current &&
          checkIfInExcludedTarget(e.target as HTMLElement, [
            ...excludeTargetClassNamesRef.current,
            "ignoreGlobalClick",
          ]))
      )
        return;
      onOutsideClickRef.current?.(e);
    };
    document.addEventListener(type, clickHandler);
    return () => {
      document.removeEventListener(type, clickHandler);
    };
  }, [rootRef?.current]);
}

export function checkIfInExcludedTarget(
  target: HTMLElement,
  excludeClassNames: string[]
): boolean {
  if (
    excludeClassNames.some((classanme) => target.classList.contains(classanme))
  )
    return true;
  if (target.parentElement)
    return checkIfInExcludedTarget(target.parentElement, excludeClassNames);
  return false;
}
