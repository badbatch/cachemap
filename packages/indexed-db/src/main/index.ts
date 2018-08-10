import { coreDefs } from "@cachemap/core";
import idb, { Cursor, DB } from "idb";
import { isNumber, isPlainObject } from "lodash";
import { ConstructorOptions, InitOptions, Options } from "../defs";

export class IndexedDBStore implements coreDefs.Store {
  public static async init(options: InitOptions): Promise<IndexedDBStore> {
    try {
      const databaseName = `${options.name}-store`;
      const objectStoreName = options.name;

      const db = await idb.open(databaseName, 1, (upgradeDB) => {
        upgradeDB.createObjectStore(objectStoreName);
      });

      return new IndexedDBStore({
        indexedDB: db,
        ...options,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public readonly type = "indexedDB";
  private _indexedDB: DB;
  private _maxHeapSize: number = 4194304;
  private _name: string;

  constructor(options: ConstructorOptions) {
    this._indexedDB = options.indexedDB;

    if (isNumber(options.maxHeapSize)) {
      this._maxHeapSize = options.maxHeapSize;
    }

    this._name = options.name;
  }

  get maxHeapSize() {
    return this._maxHeapSize;
  }

  get name() {
    return this._name;
  }

  public async clear(): Promise<void> {
    try {
      const tx = this._indexedDB.transaction(this._name, "readwrite");
      await tx.objectStore(this._name).clear();
      await tx.complete;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async delete(key: string): Promise<boolean> {
    try {
      const tx = this._indexedDB.transaction(this._name, "readwrite");
      await tx.objectStore(this._name).delete(key);
      await tx.complete;
      return await this.get(key) === undefined;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async entries(keys?: string[]): Promise<Array<[string, any]>> {
    try {
      const tx = this._indexedDB.transaction(this._name);
      const objectStore = tx.objectStore(this._name);
      const entries: Array<[string, any]> = [];

      objectStore.iterateCursor((cursor: Cursor<any, string>) => {
        if (!cursor) return;

        const key = cursor.key as string;

        if (keys) {
          if (keys.find((value) => value === key)) entries.push([key, cursor.value]);
        } else {
          if (!key.endsWith("metadata")) entries.push([key, cursor.value]);
        }

        cursor.continue();
      });

      await tx.complete;
      return entries;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get(key: string): Promise<any> {
    try {
      const tx = this._indexedDB.transaction(this._name);
      return tx.objectStore(this._name).get(key);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async has(key: string): Promise<boolean> {
    try {
      const entry = await this.get(key);
      return entry !== undefined;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async import(entries: Array<[string, any]>): Promise<void> {
    try {
      const tx = this._indexedDB.transaction(this._name, "readwrite");
      await Promise.all(entries.map(([key, value]) => tx.objectStore(this._name).put(value, key)));
      await tx.complete;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async set(key: string, value: any): Promise<void> {
    try {
      const tx = this._indexedDB.transaction(this._name, "readwrite");
      await tx.objectStore(this._name).put(value, key);
      await tx.complete;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async size(): Promise<number> {
    try {
      const tx = this._indexedDB.transaction(this._name);
      const objectStore = tx.objectStore(this._name);
      const keys: Array<IDBKeyRange | IDBValidKey> = [];

      objectStore.iterateCursor((cursor: Cursor<any, IDBKeyRange | IDBValidKey>) => {
        if (!cursor) return;

        keys.push(cursor.key);
        cursor.continue();
      });

      await tx.complete;
      return keys.length;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default function init(options: Options = {}): coreDefs.StoreInit {
  if (!isPlainObject(options)) {
    throw new TypeError("@cachemap/indexedDB expected options to be a plain object.");
  }

  return (storeOptions: coreDefs.StoreOptions) => IndexedDBStore.init({ ...options, ...storeOptions });
}
