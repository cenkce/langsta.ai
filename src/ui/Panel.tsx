import { PropsWithChildren } from "react";

export function Panel(props: PropsWithChildren) {
  return (
    <div className="bg-auto bg-current min-w-full min-h-full py-4 sm:py-12">
      <div className="grid min-h-full max-w-7xl gap-x-4 gap-y-2 px-6 lg:px-8 xl:grid-cols-3">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-4xl">Learn Smarter</h2>
        {/* <p className="mt-6 text-lg leading-8 text-gray-600">Libero fames augue nisl porttitor nisi, quis. Id ac elit odio vitae elementum enim vitae ullamcorper suspendisse.</p> */}
      <ul>
        <li>{props.children}</li>
      </ul>
      </div>
    </div>
  );
}
