import idb, { Cursor, DB } from "idb";
import { isString } from "lodash";
import { IndexedDBOptions } from "../../../types";

export default class IndexedDBProxy {
  public static async create(opts?: IndexedDBOptions): Promise<IndexedDBProxy> {
    try {
      const indexedDBProxy = new IndexedDBProxy(opts);

      indexedDBProxy._indexedDB = await idb.open(indexedDBProxy._databaseName, 1, (upgradeDB) => {
        upgradeDB.createObjectStore(indexedDBProxy._objectStoreName);
      });

      return indexedDBProxy;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _databaseName = "keyval-store";
  private _indexedDB: DB;
  private _objectStoreName = "keyval";

  constructor(opts: IndexedDBOptions = {}) {
    if (isString(opts.databaseName)) this._databaseName = opts.databaseName;
    if (isString(opts.objectStoreName)) this._objectStoreName = opts.objectStoreName;
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

      objectStore.iterateCursor((cursor: Cursor) => {
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

      objectStore.iterateCursor((cursor: Cursor) => {
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
