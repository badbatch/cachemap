import Cacheability from "cacheability";
import { ClientOpts } from "redis";
import IndexedDBProxy from "./cachemap/proxies/indexed-db";
import LocalStorageProxy from "./cachemap/proxies/local-storage";
import MapProxy from "./cachemap/proxies/map";
import RedisProxy from "./cachemap/proxies/redis";

export type ClientStoreTypes = "indexedDB" | "localStorage" | "map";

export interface CacheHeaders {
  cacheControl?: string;
  etag?: string;
  [key: string]: string;
}

export interface CachemapArgs {
  disableCacheInvalidation?: boolean;
  maxHeapSize?: { client?: number, server?: number };
  name: string;
  reaperOptions?: ReaperOptions;
  redisOptions?: ClientOpts;
  sortComparator?(a: any, b: any): number;
  use: { client?: ClientStoreTypes, server?: ServerStoreTypes };
};

export interface Metadata {
  accessedCount: number;
  added: number;
  cacheability: Cacheability;
  key: string;
  lastAccessed: number;
  lastUpdated: number;
  size: number;
}

export interface ObjectMap {
  [key: string]: any;
}

export interface PostMessageArgs {
  args?: CachemapArgs;
  callback?(value: any, key: string, cacheability: Cacheability): void;
  key?: string;
  opts?: { cacheHeaders?: CacheHeaders, deleteExpired?: boolean, hash?: boolean };
  type: string;
  value?: any;
}

export interface PostMessageResult {
  metadata: Metadata[];
  result?: any;
  usedHeapSize: number;
}

export interface ReaperOptions {
  interval?: number;
  start?: boolean;
};

export type ServerStoreTypes = "map" | "redis";
export type StoreProxyTypes = IndexedDBProxy | MapProxy | RedisProxy | LocalStorageProxy;
export type StoreTypes = "indexedDB" | "localStorage" | "map" | "redis";
