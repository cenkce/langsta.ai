export type MessageEvent<TMessage = unknown> = chrome.events.Event<
  (
    message: TMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void,
  ) => void
>;

type ExtractEventParams<T extends chrome.events.Event<FunctionConstructor>> =
  T extends chrome.events.Event<infer U> ? U : never;

export class ExtensionEventEmitter<
  TEvent extends chrome.events.Event<() => unknown> = chrome.events.Event<
    () => void
  >,
> {
  constructor(private emitter: TEvent) {}
  addListener(callback: ExtractEventParams<TEvent>) {
    this.emitter.addListener(callback);
    return () => this.removeListener(callback);
  }

  getRules(callback: (rules: chrome.events.Rule[]) => void): void;
  getRules(
    ruleIdentifiers: string[],
    callback: (rules: chrome.events.Rule[]) => void,
  ): void;
  getRules(
    ruleIdentifiers: string[] | ((rules: chrome.events.Rule[]) => void),
    callback?: (rules: chrome.events.Rule[]) => void,
  ): void {
    if (Array.isArray(ruleIdentifiers) && callback)
      this.emitter.getRules(ruleIdentifiers, callback);
    else if (callback) this.emitter.getRules(callback);
  }
  hasListener(callback: ExtractEventParams<TEvent>): boolean {
    return this.emitter.hasListener(callback);
  }
  removeRules(
    ruleIdentifiers?: string[] | undefined,
    callback?: (() => void) | undefined,
  ): void;
  removeRules(callback?: (() => void) | undefined): void;
  removeRules(
    ruleIdentifiers?: string[] | (() => void) | undefined,
    callback?: () => void,
  ): void {
    if (Array.isArray(ruleIdentifiers))
      this.emitter.removeRules(ruleIdentifiers, callback);
    else this.emitter.removeRules(callback);
  }
  addRules(
    rules: chrome.events.Rule[],
    callback?: ((rules: chrome.events.Rule[]) => void) | undefined,
  ): void {
    this.emitter.addRules(rules, callback);
  }
  removeListener(callback: ExtractEventParams<TEvent>): void {
    this.emitter.removeListener(callback);
  }
  hasListeners(): boolean {
    return this.emitter.hasListeners();
  }
}
