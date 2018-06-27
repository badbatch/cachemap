import { DB } from "idb";

export interface IndexedDBProxyArgs {
  cacheType: string;
  indexedDB: DB;
  objectStoreName: string;
}
