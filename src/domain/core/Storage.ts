import { StorageEventEmitter } from "./MessageEvent";

export interface IStorage {
  write(key: string, value: unknown): void;
  read(key: string): string;
}

export interface IAsyncStorage {
  write(key: string, value: unknown): Promise<void>;
  read(key: string): Promise<{ [key: string]: unknown }>;
}

const storage = chrome.storage.local;

export class LocalStorage implements IAsyncStorage {
  write(key: string, value: unknown): Promise<void> {
    return storage.set({ [key]: value });
  }

  read(key: string): Promise<{ [key: string]: unknown }> {
    return storage.get(key);
  }

  subscribe() {
    // chrome.
  }
}

type Changes = Parameters<Parameters<StorageEventEmitter['addListener']>[0]>[0];
type StorageAddListener = Parameters<StorageEventEmitter['addListener']>;
type StorageAddListenerCallback = StorageAddListener[0];
type AreaName = Parameters<StorageAddListenerCallback>[1];

export abstract class Storage implements IAsyncStorage {
  private emitter = new StorageEventEmitter(chrome.storage.onChanged);
  private subscribers: WeakMap<(param: Changes) => void, StorageAddListenerCallback> = new WeakMap();
  constructor(
    private storage: chrome.storage.StorageArea,
    private area: AreaName
  ) {
  }

  write(key: string, value: unknown): Promise<void> {
    return this.storage.set({ [key]: value });
  }

  read(key: string): Promise<{ [key: string]: unknown }> {
    return this.storage.get(key);
  }

  subscribe(
    handler: (changes: Changes) => void
  ) {
    const wrapper: StorageAddListenerCallback = (changes, area) => {
      if (area === this.area) {
        handler(changes);
      }
    };
    this.emitter.addListener(wrapper);
    this.subscribers.set(handler, wrapper);

    return () => {
      this.unsubscribe(handler);
    }
  }

  unsubscribe(
    handler: (changes: Changes) => void
  ) {
    if (this.subscribers.has(handler)) {
      const wrapper = this.subscribers.get(handler);
      if (wrapper && this.emitter.hasListener(wrapper)) {
        this.emitter.removeListener(wrapper);
        this.subscribers.delete(handler);
      }
    }
  }
}

export class ExtensionLocalStorage extends Storage {
  constructor() {
    super(chrome.storage.local, 'local');
  }
}

export class ExtensionSyncStorage extends Storage {
  constructor() {
    super(chrome.storage.local, 'sync');
  }
}

export class ExtensionSessionStorage extends Storage {
  constructor() {
    super(chrome.storage.local, 'session');
  }
}
