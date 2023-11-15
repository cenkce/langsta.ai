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
            size="xs"
            // className="btn btn-xs btn-outline btn-error"
            variant="outline"
            color="error"
          >
            Simpler
          </Button>
          <Button
            loading={props.loading}
            disabled={props.disabled}
            onClick={props.onTranslate}
            size="xs"
            variant="link"
          >
            Open Sidebar
          </Button>
          <Button
            loading={props.loading}
            disabled={props.disabled}
            onClick={props.onTranslate}
            size="xs"
            variant="link"
          >
            Translate
          </Button>
        </div>
      </div>
    </div>
  );
};
