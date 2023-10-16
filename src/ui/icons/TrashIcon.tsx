import { Trash2 } from "react-feather"
import { IconProps } from "."
import "./index.scss";

export const TrashIcon = (props: IconProps) => {
  return <Trash2 className="icon-common interactive-icon-common" {...props} color="#000000" size={16}  />
}
