import { XCircle } from "react-feather";
import { IconCommonProps } from ".";
import "./index.scss";
import { Icon } from "./Icon";

export const CloseIcon = (props: IconCommonProps) => {
  return <Icon size={18} {...props} IconComponent={XCircle} />;
};
