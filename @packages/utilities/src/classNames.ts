export function classNames(...args: (string | undefined | null | boolean)[]) {
  return args.reduce<string>((acc, curr, i) => {
    return (typeof args[i] === "string" && (args[i] as string).trim() !== ""
      ? i > 0 && typeof args[i - 1] === "boolean"
        ? args[i - 1] === true
          ? `${acc} ${curr}`
          : acc
        : `${acc} ${curr}`
      : acc);
  }, "").trim();
}
