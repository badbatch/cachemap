import Cacheability, { Metadata as CacheabilityMetadata } from "cacheability";
import { ClientOpts } from "redis";
import { IndexedDBProxy } from "./default-cachemap/proxies/indexed-db";
import { LocalStorageProxy } from "./default-cachemap/proxies/local-storage";
import { MapProxy } from "./default-cachemap/proxies/map";
import { RedisProxy } from "./default-cachemap/proxies/redis";

export interface CacheHeaders {
  cacheControl?: string;
  etag?: string;
  [key: string]: string;
}

export type ClientStoreTypes = "indexedDB" | "localStorage" | "map";

export interface CachemapArgs {
  /**
   * This private property is set within the WorkerCachemap to
   * tell the instance of the DefaultCachemap it is being
   * used within a web worker.
   *
   */
  _inWorker?: boolean;
  /**
   * This property disables all cache invalidation.
   * Stale entries will not be culled from the Cachemap instance
   * and the reaper will not run at set intervals if this
   * property is set to true.
   *
   */
  disableCacheInvalidation?: boolean;
  /**
   * This property specifies the database name and object
   * store name to be provided to IndexedDB. If none are
   * provided, the database name defaults to `"keyval-store"`
   * and the object store name defaults to `"keyval"`.
   *
   */
  indexedDBOptions?: IndexedDBOptions;
  /**
   * This property specifies the approximate maximum
   * memory the Cachemap instance can use on the client and server.
   * IndexedDB and LocalStorage default to 5MB, Map defaults
   * to 1MB, and Redis defaults to Infinity.
   *
   */
  maxHeapSize?: { client?: number, server?: number };
  /**
   * If `true`, this property replaces Redis with a mocked version
   * of the library, which is useful for testing.
   *
   */
  mockRedis?: boolean;
  /**
   * The name of the Cachemap instance, which is used to
   * prefix the key backed up metadata is stored against,
   * as well as prefix all LocalStorage data keys.
   *
   */
  name: string;
  /**
   * The property specifies configuration options passed
   * to the reaper: the interval time and whether to start
   * the reaper on initialisation.
   *
   */
  reaperOptions?: ReaperOptions;
  /**
   * The property specifies the configuration options passed
   * to the redis client, which are detailed on the node_redis
   * [github readme](https://github.com/NodeRedis/node_redis).
   *
   */
  redisOptions?: ClientOpts;
  /**
   * Indicates the cache is used for storing the data of
   * multiple users.
   *
   */
  sharedCache?: boolean;
  /**
   * The storage type for the client and the server. In the
   * browser, the storage type defaults to a Map, while on
   * the server it defaults to the redis client.
   *
   */
  use: { client?: ClientStoreTypes, server?: ServerStoreTypes };
  /**
   * A sort comparator to replace the default comparator used
   * to order the metadata of each data entry in the
   * DefaultCachemap instance.
   *
   */
  sortComparator?(a: any, b: any): number;
}

export interface ConvertCacheabilityMetadata extends Metadata {
  cacheability: Cacheability | { metadata: CacheabilityMetadata };
}

export interface IndexedDBOptions {
  databaseName?: string;
  objectStoreName?: string;
}

export type ImportArgs = ExportResult;

export interface ExportResult {
  entries: Array<[string, any]>;
  metadata: Metadata[];
}

export interface Metadata {
  /**
   * The number of times the corresponding data
   * entry has been accessed.
   *
   */
  accessedCount: number;
  /**
   * The timestamp of when the corresponding data
   * entry was added to the Cachemap instance.
   *
   */
  added: number;
  /**
   * The cache information of the corresponding
   * data entry, which uses the [Cacheability
   * module](https://github.com/dylanaubrey/cacheability).
   *
   */
  cacheability: Cacheability;
  /**
   * The key the corresponding data entry was stored
   * against.
   *
   */
  key: string;
  /**
   * The timestamp of when the corresponding data
   * entry was last accessed.
   *
   */
  lastAccessed: number;
  /**
   * The timestamp of when the corresponding data
   * entry was last updated.
   *
   */
  lastUpdated: number;
  /**
   * The approximate amount of memory the corresponding
   * data entry takes up.
   *
   */
  size: number;
  /**
   * A list of tags that can be optionally set along with
   * the cachemap entry and used when trying to retrieve
   * a subset of data.
   *
   */
  tags: any[];
  /**
   * The number of times the corresponding data
   * entry has been updated.
   *
   */
  updatedCount: number;
}

export interface ObjectMap {
  [key: string]: any;
}

/** @hidden */
export interface PostMessageArgs {
  args?: CachemapArgs;
  exported?: ImportArgs;
  key?: string;
  keys?: string[];
  opts?: {
    cacheHeaders?: CacheHeaders,
    deleteExpired?: boolean,
    hash?: boolean,
    keys?: string[],
    tag?: any,
  };
  type: string;
  value?: any;
}

/** @hidden */
export interface PostMessageResult {
  metadata: Metadata[];
  result?: any;
  storeType: string;
  usedHeapSize: number;
}

export interface ReaperOptions {
  interval?: number;
  start?: boolean;
}

export type ServerStoreTypes = "map" | "redis";
/** @hidden */
export type StoreProxyTypes = IndexedDBProxy | MapProxy | RedisProxy | LocalStorageProxy;
export type StoreTypes = "indexedDB" | "localStorage" | "map" | "redis";
