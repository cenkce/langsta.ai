export const verbose = (scope?: string) => (verbose?: boolean, ...messages: any[]) => {
  return verbose ? console.debug(`> ${scope} =>`, ...messages) : () => {};
}