import { PropsWithChildren } from "react";
import { CloseIcon } from "../ui/icons/CloseIcon";

export const TranslationContentCard = (
  props: PropsWithChildren<{ onClose?: () => void }>
) => {

  return (
    <div className={"TranslationContentCard_container"}>
      <CloseIcon className={"TranslationContentCard_icon"} onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        props.onClose?.();
      }} />
      <div className="TranslationContentCard_body card-body">
        <div className={"TranslationContentCard_content"}>
          {props.children}
        </div>
        <div className="card-actions justify-end"></div>
      </div>
    </div>
  );
};
