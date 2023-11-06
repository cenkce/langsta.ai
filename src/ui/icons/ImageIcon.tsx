import { MouseEvent } from "react";

export const ImageIcon = (props: {
  onClick?: (e: MouseEvent) => void;
  iconUrl: string;
}) => {
  return (
    <img
      width={"24px"}
      onClick={props.onClick}
      onMouseDown={(e) => e.stopPropagation()}
      src={chrome.runtime.getURL(props.iconUrl)}
    />
  );
};
