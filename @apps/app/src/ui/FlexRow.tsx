import { PropsWithChildren } from "react";

export const FlexRow = (props: PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={props.className}
      style={{ display: "flex", alignItems: "center", gap: "5px" }}
    >
      {props.children}
    </div>
  );
};
