import { Trash2 } from "react-feather"
import { IconCommonProps } from "."
import "./index.scss";

export const TrashIcon = (props: IconCommonProps) => {
  return <Trash2 className="icon-common interactive-icon-common" {...props} size={16}  />
}
