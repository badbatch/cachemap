import idb, { Cursor, DB } from "idb";
import { isString } from "lodash";
import { IndexedDBOptions } from "../../../types";

export default class IndexedDBProxy {
  public static async create(opts?: IndexedDBOptions): Promise<IndexedDBProxy> {
    const indexedDBProxy = new IndexedDBProxy(opts);

    indexedDBProxy._indexedDB = await idb.open(indexedDBProxy._databaseName, 1, (upgradeDB) => {
      upgradeDB.createObjectStore(indexedDBProxy._objectStoreName);
    });

    return indexedDBProxy;
  }

  private _databaseName = "keyval-store";
  private _indexedDB: DB;
  private _objectStoreName = "keyval";

  constructor(opts: IndexedDBOptions = {}) {
    if (isString(opts.databaseName)) this._databaseName = opts.databaseName;
    if (isString(opts.objectStoreName)) this._objectStoreName = opts.objectStoreName;
  }

  public async clear(): Promise<void> {
    const tx = this._indexedDB.transaction(this._objectStoreName, "readwrite");
    await tx.objectStore(this._objectStoreName).clear();
    await tx.complete;
  }

  public async delete(key: string): Promise<boolean> {
    const tx = this._indexedDB.transaction(this._objectStoreName, "readwrite");
    await tx.objectStore(this._objectStoreName).delete(key);
    await tx.complete;
    return await this.get(key) === undefined;
  }

  public async get(key: string): Promise<any> {
    const tx = this._indexedDB.transaction(this._objectStoreName);
    return tx.objectStore(this._objectStoreName).get(key);
  }

  public async has(key: string): Promise<boolean> {
    return await this.get(key) !== undefined;
  }

  public async set(key: string, value: any): Promise<void> {
    const tx = this._indexedDB.transaction(this._objectStoreName, "readwrite");
    await tx.objectStore(this._objectStoreName).put(value, key);
    await tx.complete;
  }

  public async size(): Promise<number> {
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
  }
}
