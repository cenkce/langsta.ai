import { MouseEvent, PropsWithChildren } from "react";
import "./Button.scss";
import { classNames } from "../api/utils/classNames";
import { FlexRow } from "./FlexRow";
import { LoadingIcon } from "./icons/LoadingIcon";

type ButtonVariant =
  | "circle"
  | "outline"
  | "square"
  | "ghost"
  | "link";

type ButtonSize =
  | "wide"
  | "md"
  | "sm"
  | "lg"
  | "xs";

type ButtonColor =
  | "info"
  | "accent"
  | "error"
  | "success"
  | "neutral"
  | "primary"
  | "warning"
  | "secondary";
 
export const Button = (
  props: PropsWithChildren<{
    onClick?: (e: MouseEvent) => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    color?: ButtonColor;
    className?: string;
  }>
) => {
  return (
    <button
      className={classNames(
        props.className,
        `Button btn`,
        !!props.disabled || !!props.loading,
        "btn-disabled",
        !!props.size,
        `size-${props.size}`,
        !!props.variant,
        `btn-${props.variant}`,
        !!props.color,
        `btn-${props.color}`,
      )}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      <FlexRow>
        {props.loading ? <LoadingIcon></LoadingIcon> : null}
        {props.children}
      </FlexRow>
    </button>
  );
};
