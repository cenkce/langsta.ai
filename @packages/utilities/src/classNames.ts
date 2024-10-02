/**
 * Merges class names together only if the value is a string and not empty. 
 * If the previous value is a boolean and is true, the current value will be added to the class names. 
 * 
 * @param args 
 * @returns 
 */
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
