import { MouseEvent, PropsWithChildren } from "react";
import './Button.scss';

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
  }>
) => {
  return (
    <button
      className={`Button`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
