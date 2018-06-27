import { logCacheEntry } from "../../../monitoring";

export class LocalStorageProxy {
  private _cacheType: string;
  private _storage: Storage = window.localStorage;

  constructor(cacheType: string) {
    this._cacheType = cacheType;
  }

  get cacheType(): string {
    return this._cacheType;
  }

  public async clear(): Promise<void> {
    try {
      for (let i = this._storage.length - 1; i >= 0; i -= 1) {
        const key = this._storage.key(i);
        if (key && key.startsWith(this._cacheType)) this._storage.removeItem(key);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async delete(key: string): Promise<boolean> {
    try {
      const builtKey = this._buildKey(key);
      this._storage.removeItem(builtKey);
      return this._storage.getItem(builtKey) === null;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async entries(keys?: string[]): Promise<Array<[string, any]>> {
    try {
      let _keys: string[] | undefined;

      if (keys) {
        _keys = keys.map((key) => this._buildKey(key));
      }

      const entries: Array<[string, any]> = [];
      const regex = new RegExp(`${this._cacheType}-`);

      for (let i = 0; i < this._storage.length; i += 1) {
        const key = this._storage.key(i);
        if (!key || !key.startsWith(this._cacheType)) continue;

        if (_keys) {
          if (_keys.find((val) => val === key)) {
            const item = this._storage.getItem(key);
            if (item) entries.push([key.replace(regex, ""), JSON.parse(item)]);
          }
        } else {
          if (!key.endsWith("metadata")) {
            const item = this._storage.getItem(key);
            if (item) entries.push([key.replace(regex, ""), JSON.parse(item)]);
          }
        }
      }

      return entries;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get(key: string): Promise<any> {
    try {
      const item = this._storage.getItem(this._buildKey(key));
      if (item) return JSON.parse(item);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async has(key: string): Promise<boolean> {
    try {
      return this._storage.getItem(this._buildKey(key)) !== null;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async import(entries: Array<[string, any]>): Promise<void> {
    try {
      entries.forEach(([key, value]) => {
        this._storage.setItem(this._buildKey(key), JSON.stringify(value));
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  @logCacheEntry
  public async set(key: string, value: any): Promise<void> {
    try {
      this._storage.setItem(this._buildKey(key), JSON.stringify(value));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async size(): Promise<number> {
    try {
      const keys: string[] = [];

      for (let i = 0; i < this._storage.length; i += 1) {
        const key = this._storage.key(i);
        if (key && key.startsWith(this._cacheType)) keys.push(key);
      }

      return keys.length;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _buildKey(key: string): string {
    return `${this._cacheType}-${key}`;
  }
}
