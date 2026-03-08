import { type BackupStore, type BackupStoreInit } from '@cachemap/types';
import { isNumber, isPlainObject } from 'lodash-es';
import { type ConstructorOptions, type InitOptions, type Options } from './types.ts';

export class WebStorageStore implements BackupStore {
  public static init(options: InitOptions): Promise<WebStorageStore> {
    return Promise.resolve(new WebStorageStore(options));
  }

  public readonly type = 'webStorage';
  private _backupInterval = 0;
  private readonly _maxHeapSize: number = 4_194_304;
  private readonly _name: string;
  private readonly _prefix: string;
  private _storage: Storage = globalThis.localStorage;

  constructor(options: ConstructorOptions) {
    if (isNumber(options.backupInterval)) {
      this._backupInterval = options.backupInterval;
    }

    if (isNumber(options.maxHeapSize)) {
      this._maxHeapSize = options.maxHeapSize;
    }

    this._name = options.name;
    this._prefix = `cachemap:${this._name}:`;

    if (options.storageType === 'session') {
      this._storage = globalThis.sessionStorage;
    }
  }

  get backupInterval(): number {
    return this._backupInterval;
  }

  public clear(): Promise<void> {
    for (let index = this._storage.length - 1; index >= 0; index -= 1) {
      const key = this._storage.key(index);

      if (key?.startsWith(this._prefix)) {
        this._storage.removeItem(key);
      }
    }

    return Promise.resolve();
  }

  public delete(key: string): Promise<boolean> {
    const builtKey = this._buildKey(key);
    const exists = this._storage.getItem(builtKey) !== null;

    if (exists) {
      this._storage.removeItem(builtKey);
    }

    return Promise.resolve(exists);
  }

  public entries(keys: string[]): Promise<[string, string][]> {
    const entries: [string, string][] = [];

    for (const key of keys) {
      const item = this._storage.getItem(this._buildKey(key));

      if (item !== null) {
        entries.push([key, item]);
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
      this._storage.setItem(this._buildKey(key), value);
    }

    return Promise.resolve();
  }

  get maxHeapSize(): number {
    return this._maxHeapSize;
  }

  get name(): string {
    return this._name;
  }

  public set(key: string, value: string): Promise<void> {
    this._storage.setItem(this._buildKey(key), value);
    return Promise.resolve();
  }

  public size(): Promise<number> {
    let count = 0;

    for (let index = 0; index < this._storage.length; index += 1) {
      const key = this._storage.key(index);

      if (key?.startsWith(this._prefix)) {
        count += 1;
      }
    }

    // metadata is stored alongside entries so subtract one
    return Promise.resolve(count - 1);
  }

  private _buildKey(key: string): string {
    return this._prefix + key;
  }
}

export const init = (options: Options = {}): BackupStoreInit => {
  if (!isPlainObject(options)) {
    throw new TypeError('@cachemap/web-storage expected options to be a plain object.');
  }

  return (storeOptions: { name: string }) => WebStorageStore.init({ ...options, ...storeOptions });
};
