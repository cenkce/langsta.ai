import { PropsWithChildren } from "react";

export const TranslationPopover = (props: PropsWithChildren) => {
  props.children
  return (
    <div className={'TranslationPopover'}>
      <div className="card-body">
        <h2 className="card-title">Card title!</h2>
        <p>{props.children}</p>
        <div className="card-actions justify-end">
        </div>
      </div>
    </div>
  );
};
