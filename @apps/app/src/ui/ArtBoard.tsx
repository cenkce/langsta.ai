import { PropsWithChildren } from "react";

export function ArtBoard(
  props: PropsWithChildren<{
    theme?: string;
    title?: string;
    subtitle?: string;
    className?: string;
  }>,
) {
  const className = props.className;

  return (
    <div
      data-theme={props.theme}
      data-component="artboard"
      className={`artboard ${className} min-h-full min-w-full rounded-none flex flex-col overflow-hidden`}
    >
      <div className="card-body min-h-full card-bordered min-w-full shadow-xl">
        {props.title && <h2 className="card-title">{props.title}</h2>}
        {props.subtitle && <h3 className="text-left">{props.subtitle}</h3>}
        <div className="h-full flex flex-col overflow-hidden">
          <div className="h-full flex flex-col overflow-x-scroll">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}
