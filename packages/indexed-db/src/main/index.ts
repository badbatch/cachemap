import { type Store, type StoreInit, type StoreOptions } from '@cachemap/types';
import { type IDBPDatabase, openDB } from 'idb';
import { isNumber, isPlainObject } from 'lodash-es';
import { type ConstructorOptions, type InitOptions, type Options } from '../types.ts';

export class IndexedDBStore implements Store {
  public static async init(options: InitOptions): Promise<IndexedDBStore> {
    const databaseName = `${options.name}-store`;
    const objectStoreName = options.name;

    const indexedDB = await openDB(databaseName, 1, {
      upgrade: (database: IDBPDatabase) => {
        database.createObjectStore(objectStoreName);
      },
    });

    return new IndexedDBStore({
      indexedDB,
      ...options,
    });
  }

  public readonly type = 'indexedDB';
  private _indexedDB: IDBPDatabase;
  private _maxHeapSize = 4_194_304;
  private _name: string;

  constructor(options: ConstructorOptions) {
    this._indexedDB = options.indexedDB;

    if (isNumber(options.maxHeapSize)) {
      this._maxHeapSize = options.maxHeapSize;
    }

    this._name = options.name;
  }

  public async clear(): Promise<void> {
    const tx = this._indexedDB.transaction(this._name, 'readwrite');
    await tx.objectStore(this._name).clear();
    await tx.done;
  }

  public async delete(key: string): Promise<boolean> {
    if ((await this.get(key)) === undefined) return false;
    const tx = this._indexedDB.transaction(this._name, 'readwrite');
    await tx.objectStore(this._name).delete(key);
    await tx.done;
    return true;
  }

  public async entries(keys: string[]): Promise<[string, string][]> {
    const tx = this._indexedDB.transaction(this._name);
    const entries: [string, string][] = [];
    let cursor = await tx.objectStore(this._name).openCursor();

    while (cursor) {
      const key = cursor.key as string;

      if (keys.includes(key)) {
        entries.push([key, cursor.value as string]);
      }

      cursor = await cursor.continue();
    }

    await tx.done;
    return entries;
  }

  public async get(key: string): Promise<string | undefined> {
    const tx = this._indexedDB.transaction(this._name);
    return tx.objectStore(this._name).get(key) as Promise<string | undefined>;
  }

  public async has(key: string): Promise<boolean> {
    const entry = await this.get(key);
    return entry !== undefined;
  }

  public async import(entries: [string, string][]): Promise<void> {
    const tx = this._indexedDB.transaction(this._name, 'readwrite');
    await Promise.all(entries.map(([key, value]) => tx.objectStore(this._name).put(value, key)));
    await tx.done;
  }

  get maxHeapSize() {
    return this._maxHeapSize;
  }

  get name() {
    return this._name;
  }

  public async set(key: string, value: string): Promise<void> {
    const tx = this._indexedDB.transaction(this._name, 'readwrite');
    await tx.objectStore(this._name).put(value, key);
    await tx.done;
  }

  public async size(): Promise<number> {
    const tx = this._indexedDB.transaction(this._name);
    const keys: (IDBKeyRange | IDBValidKey)[] = [];
    let cursor = await tx.objectStore(this._name).openCursor();

    while (cursor) {
      keys.push(cursor.key);
      cursor = await cursor.continue();
    }

    await tx.done;
    // metadata is stored in the same DB as the
    // entries it describes, so we need to remove
    // one entry to get actual size
    return keys.length - 1;
  }
}

export const init = (options: Options = {}): StoreInit => {
  if (!isPlainObject(options)) {
    throw new TypeError('@cachemap/indexedDB expected options to be a plain object.');
  }

  return (storeOptions: StoreOptions) => IndexedDBStore.init({ ...options, ...storeOptions });
};
