import IndexedDBProxy from "idb-keyval";
import { ClientOpts } from "redis";
import LocalStorageProxy from "./local-storage-proxy";
import MapProxy from "./map-proxy";
import RedisProxy from "./redis-proxy";

export type ClientStoreTypes = "indexedDB" | "localStorage" | "map";

export interface CachemapArgs {
  disableCacheInvalidation: boolean;
  maxHeapSize?: { client?: number, server?: number };
  mock: boolean;
  reaperOptions: ReaperOptions;
  redisOptions: ClientOpts;
  sortComparator?(a: any, b: any): number;
  use?: { client?: ClientStoreTypes, server?: ServerStoreTypes };
};

export interface Metadata {

}

export interface ObjectMap {
  [key: string]: any;
}

export interface ReaperOptions {
  interval: number;
  start: boolean;
};

export type ServerStoreTypes = "map" | "redis";
export type StoreProxyTypes = IndexedDBProxy | MapProxy | RedisProxy | StorageProxy;
export type StoreTypes = "indexedDB" | "localStorage" | "map" | "redis";
