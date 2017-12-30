export default class LocalStorageProxy {
  private _storage = window.localStorage;

  public async clear(): Promise<void> {
    try {
      this._storage.clear();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async delete(key: string): Promise<boolean> {
    try {
      this._storage.removeItem(key);
      return this._storage.getItem(key) === null;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get(key: string): Promise<any> {
    try {
      const item = this._storage.getItem(key);
      if (item) return JSON.parse(item);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async has(key: string): Promise<boolean> {
    try {
      return this._storage.getItem(key) !== null;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async set(key: string, value: any): Promise<void> {
    try {
      this._storage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async size(): Promise<number> {
    try {
      return this._storage.length;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
