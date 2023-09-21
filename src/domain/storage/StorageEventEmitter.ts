import { ExtensionEventEmitter } from "../../core/MessageEvent";


export class StorageEventEmitterImpl extends ExtensionEventEmitter<chrome.storage.StorageChangedEvent> {
  constructor(){
    super(chrome.storage.onChanged)
  }
}

export const StorageEventEmitterInstance = new StorageEventEmitterImpl();
