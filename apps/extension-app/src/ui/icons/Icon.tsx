import { FunctionComponent } from "react";
import { IconCommonProps } from ".";

export const Icon = (
  props: IconCommonProps & {
    IconComponent: FunctionComponent<Omit<IconCommonProps, "onClick">>;
    size?: number
  }
) => {
  const { className, IconComponent, ...restProps } = props;
  return (
    <IconComponent
      {...restProps}
      className={`icon-common interactive-icon-common ${className || ""}`}
    />
  );
};
