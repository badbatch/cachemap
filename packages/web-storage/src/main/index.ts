import { type Store, type StoreInit, type StoreOptions } from '@cachemap/types';
import { isNumber, isPlainObject } from 'lodash-es';
import { type ConstructorOptions, type InitOptions, type Options } from '../types.ts';

export class WebStorageStore implements Store {
  public static init(options: InitOptions): Promise<WebStorageStore> {
    return Promise.resolve(new WebStorageStore(options));
  }

  public readonly type = 'webStorage';
  private _maxHeapSize = 4_194_304;
  private _name: string;
  private _storage: Storage = window.localStorage;

  constructor(options: ConstructorOptions) {
    if (isNumber(options.maxHeapSize)) {
      this._maxHeapSize = options.maxHeapSize;
    }

    this._name = options.name;

    if (options.storageType === 'session') {
      this._storage = window.sessionStorage;
    }
  }

  public clear(): Promise<void> {
    for (let index = this._storage.length - 1; index >= 0; index -= 1) {
      const key = this._storage.key(index);

      if (key?.startsWith(this._name)) {
        this._storage.removeItem(key);
      }
    }

    return Promise.resolve();
  }

  public delete(key: string): Promise<boolean> {
    const builtKey = this._buildKey(key);

    if (this._storage.getItem(builtKey) === null) {
      return Promise.resolve(false);
    }

    this._storage.removeItem(builtKey);
    return Promise.resolve(true);
  }

  public entries(keys: string[]): Promise<[string, string][]> {
    const entryKeys = new Set(keys.map(key => this._buildKey(key)));
    const entries: [string, string][] = [];
    const regex = new RegExp(`${this._name}-`);

    for (let index = 0; index < this._storage.length; index += 1) {
      const key = this._storage.key(index);

      if (!key?.startsWith(this._name)) {
        continue;
      }

      if (entryKeys.has(key)) {
        const item = this._storage.getItem(key);

        if (item) {
          entries.push([key.replace(regex, ''), item]);
        }
      }
    }

    return Promise.resolve(entries);
  }

  public get(key: string): Promise<string | undefined> {
    return Promise.resolve(this._storage.getItem(this._buildKey(key)) ?? undefined);
  }

  public has(key: string): Promise<boolean> {
    return Promise.resolve(this._storage.getItem(this._buildKey(key)) !== null);
  }

  public import(entries: [string, string][]): Promise<void> {
    for (const [key, value] of entries) {
      this._storage.setItem(this._buildKey(key), JSON.stringify(value));
    }

    return Promise.resolve();
  }

  get maxHeapSize() {
    return this._maxHeapSize;
  }

  get name() {
    return this._name;
  }

  public set(key: string, value: string): Promise<void> {
    this._storage.setItem(this._buildKey(key), value);
    return Promise.resolve();
  }

  public size(): Promise<number> {
    const keys: string[] = [];

    for (let index = 0; index < this._storage.length; index += 1) {
      const key = this._storage.key(index);

      if (key?.startsWith(this._name)) {
        keys.push(key);
      }
    }

    // metadata is stored in the same DB as the
    // entries it describes, so we need to remove
    // one entry to get actual size
    return Promise.resolve(keys.length - 1);
  }

  private _buildKey(key: string): string {
    return `${this._name}-${key}`;
  }
}

export const init = (options: Options = {}): StoreInit => {
  if (!isPlainObject(options)) {
    throw new TypeError('@cachemap/map expected options to be a plain object.');
  }

  return (storeOptions: StoreOptions) => WebStorageStore.init({ ...options, ...storeOptions });
};
