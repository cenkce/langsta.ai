import { Storage } from "../storage/Storage";
import { ContentContextState, ContentStorageList } from "./ContentContext.atom";


export class ContentStorage<T extends Record<string, unknown> = Record<string, unknown>> extends Storage<T> {
  private static storages: Map<ContentStorageList, ContentStorage<Record<string, unknown>>> = new Map();

  static of(key: ContentStorageList){
    const storage = this.getStorage(key) || new ContentStorage(key);
    if(!ContentStorage.storages.has(key))
      ContentStorage.storages.set(key, storage);

    return storage;
  }

  static getStorage(key: ContentStorageList){
    return this.storages.get(key);
  }

  constructor(private storageName: ContentStorageList){
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

  protected getKeys(): (keyof ContentContextState)[] {
    return ['selectedText', 'activeTabContent', 'translation'];
  }

  protected getStorageName() {
    return this.storageName;
  }

  protected checkValidData(): boolean {
    return true; 
  }
  
}
