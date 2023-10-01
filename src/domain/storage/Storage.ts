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

// type Length<T extends any[]> =
//   T extends { length: infer L } ? L : never;

// type BuildTuple<L extends number, T extends any[] = []> =
//   T extends { length: L } ? T : BuildTuple<L, [...T, any]>;
// type Tt = Length<BuildTuple<3>>

type Tuples<T extends Record<string, any>> = T extends Record<infer K, infer V>
  ? [K, V]
  : [];

// type MergeUnion<
//   Arr extends {[k: string]: any},
//   Result extends {[k: string]: any} = {[k: string]: any},
//   Index extends number[] = []
//   > =
//   Arr extends []
//   ? Result
//   : Arr extends [infer Key, infer Value, ...infer Tail]
//   ? MergeUnion<[...Tail], Result | {[K in keyof Key]: Value}, [...Index, 2]>
//   : Readonly<Result>;

export abstract class Storage<
  TData extends Record<string, any> = Record<string, any>,
  U extends [string, any] = Tuples<TData>
> {
  private emitter = new StorageEventEmitter();
  private subscribers: WeakMap<
    (param: Changes) => void,
    StorageAddListenerCallback
  > = new WeakMap();

  constructor() {}

  write = (...params: U): Promise<void> => {
    return this.getStorageInstance().set({ [params[0]]: params[1] });
  };

  read = (key: U[0]) => {
    return this.getStorageInstance()
      .get(this.getStorageName())
      .then((data) => data[this.getStorageName()][key]);
  };

  getState() {
    return this.getStorageInstance()
      .get(this.getStorageName())
      .then((data) => data[this.getStorageName()]);
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
      console.log("unsubscribe");
      this.unsubscribe(handler);
    };
  };

  /**
   * @template
   * Returns storafe areaname
   */
  protected abstract getStoragAreaName(): AreaName;

  /**
   * @template
   * 
   * Refurns a storage instance
   */
  protected abstract getStorageInstance(): chrome.storage.StorageArea;

  /**
   * @template
   * 
   * Return storage name
   */
  protected abstract getStorageName(): string;

  /**
   * @template
   * 
   * In order to filter out the result
   */
  protected abstract checkValidData(changes: Changes): boolean;

  /**
   * Returns storage field names
   */
  protected abstract getKeys(): U[0][];

  /**
   * Returns storage field names
   */
  get keys(): U[0][] {
    return this.getKeys();
  }

  unsubscribe = (handler: (changes: Changes) => void) => {
    if (this.subscribers.has(handler)) {
      const wrapper = this.subscribers.get(handler);
      if (wrapper) {
        this.emitter.removeListener(wrapper);
        this.subscribers.delete(handler);
      }
    }
  };
}
