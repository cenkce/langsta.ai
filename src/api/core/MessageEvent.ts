export type MessageEvent<TMessage = unknown> = chrome.events.Event<
  (
    message: TMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => void
>;

type ExtractEventParams<T extends chrome.events.Event<any>> =
  T extends chrome.events.Event<infer U> ? U : never;

export class ExtensionEventEmitter<
  TEvent extends chrome.events.Event<() => unknown> = chrome.events.Event<
    () => void
  >
> {
  constructor(private emitter: TEvent) {}
  addListener(callback: ExtractEventParams<TEvent>) {
    this.emitter.addListener(callback);
    return () => this.removeListener(callback);
  }
  getRules(callback: (rules: chrome.events.Rule[]) => void): void;
  getRules(
    ruleIdentifiers: string[],
    callback: (rules: chrome.events.Rule[]) => void
  ): void;
  getRules(ruleIdentifiers: any, callback?: any): void {
    this.emitter.getRules(ruleIdentifiers, callback);
  }
  hasListener(
    callback: ExtractEventParams<TEvent>
  ): boolean {
    return this.emitter.hasListener(callback);
  }
  removeRules(
    ruleIdentifiers?: string[] | undefined,
    callback?: (() => void) | undefined
  ): void;
  removeRules(callback?: (() => void) | undefined): void;
  removeRules(ruleIdentifiers?: any, callback?: any): void {
    this.emitter.removeRules(ruleIdentifiers, callback);
  }
  addRules(
    rules: chrome.events.Rule[],
    callback?: ((rules: chrome.events.Rule[]) => void) | undefined
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


