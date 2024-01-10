import { PropsWithChildren } from "react";
import { CloseIcon } from "../ui/icons/CloseIcon";
import { Button } from "../ui/Button";
import { classNames } from "@espoojs/utils";

export type TranslationContentActions = 'sidebar' | 'translate' | 'summarise' | 'simplify' | 'study-mode';

export const TranslationContentCard = (
  props: PropsWithChildren<{
    onClose?: () => void;
    onAction?: (action: TranslationContentActions) => void;
    disabled?: boolean;
    loading?: boolean;
    action?: TranslationContentActions;
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
        className={"TranslationContentCard_closeIcon"}
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
            "TranslationContentCard_actions",
          )}
        >
          <Button
            onClick={() => props.onAction?.('sidebar')}
            size="xs"
            variant="outline"
            color="secondary"
          >
            Open Sidebar
          </Button>
          <Button
            onClick={() => props.onAction?.('study-mode')}
            size="xs"
            variant="outline"
            color="secondary"
          >
            Read Mode
          </Button>
          <Button
            loading={props.loading && props.action === 'simplify'}
            disabled={props.disabled}
            onClick={() => props.onAction?.('simplify')}
            size="xs"
            variant="outline"
            color="info"
          >
            Simplify
          </Button>
          <Button
            loading={props.loading && props.action === 'summarise'}
            disabled={props.disabled}
            onClick={() => props.onAction?.('summarise')}
            size="xs"
            variant="outline"
            color="info"
          >
            Summarise
          </Button>
          <Button
            loading={props.loading && props.action === 'translate'}
            disabled={props.disabled}
            onClick={() => props.onAction?.('translate')}
            size="xs"
            variant="outline"
            color="info"
          >
            Translate
          </Button>
        </div>
      </div>
    </div>
  );
};
