import { PropsWithChildren } from "react";

export function ArtBoard(
  props: PropsWithChildren<{ theme?: string; title?: string, subtitle?: string  }>
) {
  return (
    <div
      data-theme={props.theme}
      data-component="artboard"
      className="card artboard artboard-horizontal flex phone-3 min-h-full rounded-none"
    >
      <div className="card-body min-h-full card-bordered min-w-full shadow-xl">
        <h2 className="card-title">{props.title}</h2>
        <h3 className="text-left">{props.subtitle}</h3>
        <ul className="h-full">
          <li className="h-full overflow-hidden overflow-x-auto">{props.children}</li>
        </ul>
      </div>
    </div>
  );
}