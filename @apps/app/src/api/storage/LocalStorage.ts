import { Collection } from "./Collection";
import { Storage } from "./Storage";

export class LocalStorage<T extends Collection = Collection, NameT extends string = string> extends Storage<T> {
  private static storages: Map<string, LocalStorage<Collection>>;
  
  static {
    this.storages = new Map();
  }

  static of<TState extends Collection = Collection, NameST extends string = string>(key: NameST) {
    const storage = this.getStorage(key) || new LocalStorage(key);
    if(!LocalStorage.storages.has(key))
      LocalStorage.storages.set(key, storage);
    return storage as LocalStorage<TState, NameST>;
  }

  static getStorage(key: string) {
    return this.storages.get(key);
  }

  constructor(private storageName: NameT) {
    super();
  }

  get name() {
    return this.storageName;
  }

  protected getStoragAreaName(): "sync" | "local" | "managed" | "session" {
    return 'local';
  }

  protected getStorageInstance(): chrome.storage.StorageArea {
    return chrome.storage.local;
  }

  protected getStorageName() {
    return this.storageName;
  }

  protected checkValidData(): boolean {
    return true; 
  }
  
}
