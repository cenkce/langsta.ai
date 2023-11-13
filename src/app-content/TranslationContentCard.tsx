import { PropsWithChildren } from "react";
import { CloseIcon } from "../ui/icons/CloseIcon";
import { Button } from "../ui/Button";
import { classNames } from "../api/utils/classNames";

export const TranslationContentCard = (
  props: PropsWithChildren<{
    onClose?: () => void;
    onTranslate?: () => void;
    disabled?: boolean;
    loading?: boolean;
  }>
) => {
  return (
    <div
      className={"TranslationContentCard_container"}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <CloseIcon
        className={"TranslationContentCard_icon"}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props.onClose?.();
        }}
      />
      <div className="TranslationContentCard_body card-body">
        <div className={"TranslationContentCard_content"}>{props.children}</div>
        <div
          className={classNames(
            "card-actions",
            "justify-end",
            !!props.disabled,
            "TranslationContentCard_disabled"
          )}
        >
          <Button
            loading={props.loading}
            disabled={props.disabled}
            onClick={props.onTranslate}
          >
            Translate
          </Button>
        </div>
      </div>
    </div>
  );
};
