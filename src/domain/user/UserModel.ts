import { IAsyncStorage } from "../core/Storage";


export class UserModel {
  constructor(private storage: IAsyncStorage){
  }

  getLatestCopiedContent(){
    return this.storage.read("user-copied-content");
  }

  setLatestCopiedContent(content: string){
    return this.storage.write("user-copied-content", content);
  }

  setApiKey(apikey: string) {
    return this.storage.write('apikey', apikey);
  }

  async getApiKey() {
    const res = await this.storage.read('apikey');
    if ('apikey' in res)
      return res['apikey'];
    else res;
  }
}
