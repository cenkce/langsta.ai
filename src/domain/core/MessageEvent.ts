export type MessageEvent<TMessage = any> = chrome.events.Event<
  (
    message: TMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
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
    chrome.runtime.onMessage.getRules(ruleIdentifiers, callback);
  }
  hasListener(
    callback: ExtractEventParams<TEvent>
  ): boolean {
    return chrome.runtime.onMessage.hasListener(callback);
  }
  removeRules(
    ruleIdentifiers?: string[] | undefined,
    callback?: (() => void) | undefined
  ): void;
  removeRules(callback?: (() => void) | undefined): void;
  removeRules(ruleIdentifiers?: any, callback?: any): void {
    chrome.runtime.onMessage.removeRules(ruleIdentifiers, callback);
  }
  addRules(
    rules: chrome.events.Rule[],
    callback?: ((rules: chrome.events.Rule[]) => void) | undefined
  ): void {
    chrome.runtime.onMessage.addRules(rules, callback);
  }
  removeListener(callback: ExtractEventParams<TEvent>): void {
    chrome.runtime.onMessage.removeListener(callback);
  }
  hasListeners(): boolean {
    return chrome.runtime.onMessage.hasListeners();
  }
}

export class MessageEventEmitter extends ExtensionEventEmitter<chrome.runtime.ExtensionMessageEvent> {}
export class StorageEventEmitter extends ExtensionEventEmitter<chrome.storage.StorageChangedEvent> {}
