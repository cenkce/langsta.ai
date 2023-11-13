import { MouseEvent, PropsWithChildren } from "react";
import "./Button.scss";
import { classNames } from "../api/utils/classNames";
import { FlexRow } from "./FlexRow";
import { LoadingIcon } from "./icons/LoadingIcon";

type ButtonVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "link";
export const Button = (
  props: PropsWithChildren<{
    onClick?: (e: MouseEvent) => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
  }>
) => {
  return (
    <button
      className={classNames(
        `Button`,
        !!props.disabled || !!props.loading,
        "Button_disabled"
      )}
      onClick={props.onClick}
    >
      <FlexRow>
        {props.loading ? <LoadingIcon></LoadingIcon> : null}
        {props.children}
      </FlexRow>
    </button>
  );
};
