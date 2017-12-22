export default class LocalStorageProxy {
  private _storage = window.localStorage;

  public async clear(): Promise<void> {
    this._storage.clear();
  }

  public async delete(key: string): Promise<boolean> {
    this._storage.removeItem(key);
    return this._storage.getItem(key) === null;
  }

  public async get(key: string): Promise<any> {
    const item = this._storage.getItem(key);
    if (item) return Promise.resolve(JSON.parse(item));
  }

  public async has(key: string): Promise<boolean> {
    return Promise.resolve(this._storage.getItem(key) !== null);
  }

  public async set(key: string, value: any): Promise<void> {
    this._storage.setItem(key, JSON.stringify(value));
  }

  public async size(): Promise<number> {
    return Promise.resolve(this._storage.length);
  }
}
