import { Storage } from "../storage/Storage";
import { ContentContextState } from "./ContentContext.atom";


export class ContentStorage extends Storage<ContentContextState> {
  constructor(private storageName: string){
    super();
  }

  protected getStoragAreaName(): "sync" | "local" | "managed" | "session" {
    return 'local';
  }

  protected getStorageInstance(): chrome.storage.StorageArea {
    return chrome.storage.local;
  }

  protected getKeys(): (keyof ContentContextState)[] {
    return ['selectedText', 'activeTabContent'];
  }

  protected getStorageName() {
    return this.storageName;
  }

  protected checkValidData(): boolean {
    return true; 
  }
}
