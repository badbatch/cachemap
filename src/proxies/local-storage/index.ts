export default class LocalProxy {
  private _storage = window.localStorage;

  public async clear(): Promise<void> {
    this._storage.clear();
  }

  public async delete(key: string): Promise<void> {
    this._storage.removeItem(key);
  }

  public async get(key: string): Promise<any> {
    return Promise.resolve(this._storage.getItem(key));
  }

  public async has(key: string): Promise<boolean> {
    return Promise.resolve(this._storage.getItem(key) !== null);
  }

  public async set(key: string, value: any): Promise<void> {
    this._storage.setItem(key, value);
  }

  public async size(): Promise<number> {
    return Promise.resolve(this._storage.length);
  }
}
