import { Collection } from "./Collection";
import { StorageEventEmitter } from "./StorageEventEmitter";

export interface IStorage {
  write(key: string, value: unknown): void;
  read(key: string): string;
}

export interface IAsyncStorage {
  write(...params: [string, unknown]): Promise<void>;
  read(key: string): Promise<{ [key: string]: unknown }>;
}

type Changes = Parameters<
  Parameters<chrome.storage.StorageChangedEvent["addListener"]>[0]
>[0];
type StorageAddListener = Parameters<
  chrome.storage.StorageChangedEvent["addListener"]
>;
type StorageAddListenerCallback = StorageAddListener[0];
export type AreaName = Parameters<StorageAddListenerCallback>[1];

type Tuples<T extends Collection> = T extends Collection<infer K, infer V>
  ? [K, V]
  : [];

export abstract class Storage<
  StateT extends Collection = Collection,
  U extends [string, unknown] = Tuples<StateT>
> {
  private emitter = new StorageEventEmitter();
  private subscribers: WeakMap<
    (param: Changes) => void,
    StorageAddListenerCallback
  > = new WeakMap();
  private handlers = new Set<(param: Changes) => void>();

  constructor() {
    // this.getStorageInstance().clear();
  }

  write = async (...params: U): Promise<void> => {
    const state = await this.getState();
    const update = { [params[0]]: params[1] };
    return this.getStorageInstance().set({
      [this.getStorageName()]: {
        ...state,
        ...update,
      },
    });
  };

  load = async (params: StateT): Promise<void> => {
    if (!(this.getStorageName() in params))
      return this.getStorageInstance().set({ [this.getStorageName()]: params });
  };

  read = async <M extends Tuples<Required<StateT>>[0]>(key: M) => {
    const data = await this.getStorageInstance().get(this.getStorageName());
    return data[this.getStorageName()][key];
  };

  getState(): Promise<StateT> {
    return this.getStorageInstance()
      .get(this.getStorageName())
      .then((data) => {
        return data[this.getStorageName()];
      });
  }

  subscribe = (handler: (changes: Changes) => void) => {
    const wrapper: StorageAddListenerCallback = (changes, area) => {
      if (area === this.getStoragAreaName() && this.checkValidData(changes)) {
        handler(changes);
      }
    };
    this.emitter.addListener(wrapper);
    this.subscribers.set(handler, wrapper);

    return () => {
      this.unsubscribe(handler);
    };
  };

  /**
   * @template
   * Returns storafe areaname
   */
  protected abstract getStoragAreaName(): AreaName;

  /**
   *
   * Refurns a storage instance
   */
  protected abstract getStorageInstance(): chrome.storage.StorageArea;

  /**
   *
   * Return storage name
   */
  protected abstract getStorageName(): string;

  /**
   *
   * In order to filter out the result
   */
  protected abstract checkValidData(changes: Changes): boolean;

  dispose() {
    for (const handler of this.handlers) {
      this.unsubscribe(handler);
    }
  }

  unsubscribe = (handler: (changes: Changes) => void) => {
    if (this.subscribers.has(handler)) {
      const wrapper = this.subscribers.get(handler);
      this.handlers.delete(handler);
      if (wrapper) {
        this.emitter.removeListener(wrapper);
        this.subscribers.delete(handler);
      }
    }
  };
}
