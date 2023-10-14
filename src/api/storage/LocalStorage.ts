import { Storage } from "./Storage";


export class LocalStorage<T extends Record<string, unknown> = Record<string, unknown>, NameT extends string = string> extends Storage<T> {
  private static storages: Map<string, LocalStorage<Record<string, unknown>>>;
  
  static {
    this.storages = new Map();
  }

  static of<TState extends Record<string, unknown> = Record<string, unknown>, NameST extends string = string>(key: NameST){
    const storage = this.getStorage(key) || new LocalStorage(key);
    if(!LocalStorage.storages.has(key))
      LocalStorage.storages.set(key, storage);

    return storage as LocalStorage<TState, NameST>;
  }

  static getStorage(key: string){
    return this.storages.get(key);
  }

  constructor(private storageName: NameT){
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
