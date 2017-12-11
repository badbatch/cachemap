import idbKeyval from "idb-keyval";

export default class IndexedDBProxy {
  private _indexedDB = idbKeyval;

  public async clear(): Promise<void> {
    await this._indexedDB.clear();
  }

  public async delete(key: string): Promise<void> {
    await this._indexedDB.delete(key);
  }

  public async get(key: string): Promise<any> {
    return this._indexedDB.get(key);
  }

  public async has(key: string): Promise<boolean> {
    return await this._indexedDB.get(key) !== undefined;
  }

  public async set(key: string, value: any): Promise<void> {
    await this._indexedDB.set(key, value);
  }

  public async size(): Promise<number> {
    const keys = await this._indexedDB.keys();
    return keys.length;
  }
}
