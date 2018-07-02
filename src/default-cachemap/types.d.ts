import { ClientOpts } from "redis";
import { IndexedDBOptions, ReaperOptions, StoreProxyTypes, StoreTypes } from "../types";

/** @hidden */
export interface CreateStoreArgs {
  indexedDBOptions?: IndexedDBOptions;
  inWorker?: boolean;
  mockRedis?: boolean;
  name: string;
  redisOptions?: ClientOpts;
  storeType: StoreTypes;
}

/** @hidden */
export interface CreateStoreResult {
  store: StoreProxyTypes;
  storeType: StoreTypes;
}

export interface DefaultCachemapArgs {
  _inWorker?: boolean;
  disableCacheInvalidation?: boolean;
  maxHeapSize: { client?: number, server?: number };
  name: string;
  reaperOptions?: ReaperOptions;
  sharedCache?: boolean;
  store: StoreProxyTypes;
  storeType: StoreTypes;
  sortComparator?(a: any, b: any): number;
}
