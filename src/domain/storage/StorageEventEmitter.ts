import { ExtensionEventEmitter } from "../../core/MessageEvent";


export class StorageEventEmitter extends ExtensionEventEmitter<chrome.storage.StorageChangedEvent> {
  constructor(){
    super(chrome.storage.onChanged)
  }
}
