import { core, indexedDB } from "@cachemap/types";
import idb, { Cursor, DB } from "idb";
import { isNumber, isPlainObject } from "lodash";

export class IndexedDBStore implements core.Store {
  public static async init(options: indexedDB.InitOptions): Promise<IndexedDBStore> {
    try {
      const databaseName = `${options.name}-store`;
      const objectStoreName = options.name;

      const db = await idb.open(databaseName, 1, (upgradeDB) => {
        upgradeDB.createObjectStore(objectStoreName);
      });

      return new IndexedDBStore({ indexedDB: db, objectStoreName });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _indexedDB: DB;
  private _maxHeapSize: number = 4194304;
  private _objectStoreName: string;

  constructor(options: indexedDB.ConstructorOptions) {
    this._indexedDB = options.indexedDB;

    if (isNumber(options.maxHeapSize)) {
      this._maxHeapSize = options.maxHeapSize;
    }

    this._objectStoreName = options.objectStoreName;
  }

  get maxHeapSize() {
    return this._maxHeapSize;
  }

  public async clear(): Promise<void> {
    try {
      const tx = this._indexedDB.transaction(this._objectStoreName, "readwrite");
      await tx.objectStore(this._objectStoreName).clear();
      await tx.complete;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async delete(key: string): Promise<boolean> {
    try {
      const tx = this._indexedDB.transaction(this._objectStoreName, "readwrite");
      await tx.objectStore(this._objectStoreName).delete(key);
      await tx.complete;
      return await this.get(key) === undefined;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async entries(keys?: string[]): Promise<Array<[string, any]>> {
    try {
      const tx = this._indexedDB.transaction(this._objectStoreName);
      const objectStore = tx.objectStore(this._objectStoreName);
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
      const tx = this._indexedDB.transaction(this._objectStoreName);
      return tx.objectStore(this._objectStoreName).get(key);
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
      const tx = this._indexedDB.transaction(this._objectStoreName, "readwrite");
      await Promise.all(entries.map(([key, value]) => tx.objectStore(this._objectStoreName).put(value, key)));
      await tx.complete;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async set(key: string, value: any): Promise<void> {
    try {
      const tx = this._indexedDB.transaction(this._objectStoreName, "readwrite");
      await tx.objectStore(this._objectStoreName).put(value, key);
      await tx.complete;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async size(): Promise<number> {
    try {
      const tx = this._indexedDB.transaction(this._objectStoreName);
      const objectStore = tx.objectStore(this._objectStoreName);
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

export default function indexedDBWrapper(options: indexedDB.Options): core.StoreWrapper {
  if (!isPlainObject(options)) {
    throw new TypeError("indexedDBWrapper expected options to be a plain object.");
  }

  return (inheritedOptions: indexedDB.InheritedOptions) => IndexedDBStore.init({ ...options, ...inheritedOptions });
}
