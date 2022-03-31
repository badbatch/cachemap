import { BaseMetadata, Metadata } from "@cachemap/types";
import { Metadata as CacheabilityMetadata } from "cacheability";

export interface BaseOptions {
  /**
   * The time in milliseconds between back ups from a map store
   * to the provided persisted store.
   */
  backupInterval?: number;
  /**
   * Whether to use store to back up to from a map store. If true,
   * the provided store is used to periodically back up to rather than
   * directly write to. This makes reading/writing much quicker, but
   * still gives you persistence across browser reloads or server
   * restarts. If true, the store should be a peristed store.
   */
  backupStore?: boolean;
  /**
   * Whether to disable the checking of a cache entry's TTL before
   * returning the entry. This also disabling the purging of stale
   * cache entries by the reaper, if one is configured.
   */
  disableCacheInvalidation?: boolean;
  /**
   * This is used to encrypt all entries. If a secret is provided,
   * all entries are encrypted.
   */
  encryptionSecret?: string;
  /**
   * The name is primarily used as a target for the controller, in order
   * to centrally control the cachemap in an application with muliple
   * instances.
   */
  name: string;
  /**
   * The reaper is used to keep the cachemap size below user specified limits
   * by purging the least imporant entries in the cachemap.
   */
  reaper?: ReaperInit;
  /**
   * Whether the cache is shared. If true, entries with a cache control
   * header of "private" are not stored in the cachemap.
   */
  sharedCache?: boolean;
  /**
   * Whether to start backing up store on initialisation. If set to false,
   * you would be triggering the backup through the controller.
   */
  startBackup?: boolean;
  /**
   * The type is primarily used as a target for the controller, in order
   * to centrally control a group of cachemaps in an application with muliple
   * instances.
   */
  type: string;
  /**
   * The sort comparator is used to order cachemap entries by importance so the
   * reaper knows what entries to purge first.
   */
  sortComparator?(a: any, b: any): number;
}

export type CacheHeaders = Headers | { cacheControl?: string; etag?: string };

export interface ConstructorOptions extends BaseOptions {
  store: StoreInit;
}

export interface DehydratedMetadata extends BaseMetadata {
  cacheability: { metadata: CacheabilityMetadata };
}

export type FilterByValue = { comparator: any; keyChain: string };

export type ControllerEvent = {
  name?: string;
  type?: string;
};

export interface ExportOptions {
  filterByValue?: FilterByValue | FilterByValue[];
  keys?: string[];
  tag?: any;
}

export interface ExportResult {
  entries: [string, any][];
  metadata: Metadata[];
}

export interface ImportOptions {
  entries: [string, any][];
  metadata: Metadata[];
}

export interface PlainObject {
  [key: string]: any;
}

export interface Reaper {
  cull(metadata: Metadata[]): Promise<void>;
  start(): void;
  stop(): void;
}

export interface ReaperCallbacks {
  deleteCallback: (key: string, options?: { hash?: boolean }) => Promise<boolean>;
  metadataCallback: () => Metadata[];
}

export type ReaperInit = (callbacks: ReaperCallbacks) => Reaper;

export type MethodName = "clear" | "delete" | "entries" | "export" | "get" | "has" | "import" | "set" | "size";

export type RequestQueue<T = any> = [(value?: T) => void, MethodName, any[]][];

export interface Store {
  readonly maxHeapSize: number;
  readonly name: string;
  readonly type: string;
  clear(): Promise<void>;
  delete(key: string): Promise<boolean>;
  entries(keys?: string[]): Promise<[string, any][]>;
  get(key: string): Promise<any>;
  has(key: string): Promise<boolean>;
  import(entries: [string, any][]): Promise<void>;
  set(key: string, value: any): Promise<void>;
  size(): Promise<number>;
}

export interface StoreOptions {
  name: string;
}

export type StoreInit = (options: StoreOptions) => Promise<Store>;
