import Cacheability, { Metadata as CacheabilityMetadata } from "cacheability";

export interface BaseMetadata {
  /**
   * The number of times the corresponding data
   * entry has been accessed.
   */
  accessedCount: number;

  /**
   * The timestamp of when the corresponding data
   * entry was added to the Cachemap instance.
   */
  added: number;

  /**
   * The key the corresponding data entry was stored
   * against.
   */
  key: string;

  /**
   * The timestamp of when the corresponding data
   * entry was last accessed.
   */
  lastAccessed: number;

  /**
   * The timestamp of when the corresponding data
   * entry was last updated.
   */
  lastUpdated: number;

  /**
   * The approximate amount of memory the corresponding
   * data entry takes up.
   */
  size: number;

  /**
   * A list of tags that can be optionally set along with
   * the cachemap entry and used when trying to retrieve
   * a subset of data.
   */
  tags: any[];

  /**
   * The number of times the corresponding data
   * entry has been updated.
   */
  updatedCount: number;
}

export interface BaseOptions {
  disableCacheInvalidation?: boolean;
  name: string;
  reaper?: ReaperInit;
  sharedCache?: boolean;
  sortComparator?(a: any, b: any): number;
}

export type CacheHeaders = Headers | { cacheControl?: string; etag?: string };

export interface ConstructorOptions extends BaseOptions {
  store: Store;
}

export interface DehydratedMetadata extends BaseMetadata {
  cacheability: { metadata: CacheabilityMetadata };
}

export interface ExportOptions {
  keys?: string[];
  tag?: any;
}

export interface ExportResult {
  entries: Array<[string, any]>;
  metadata: Metadata[];
}

export interface ImportOptions {
  entries: Array<[string, any]>;
  metadata: Metadata[];
}

export interface InitOptions extends BaseOptions {
  store: StoreInit;
}

export interface Metadata extends BaseMetadata {
  /**
   * The cache information of the corresponding
   * data entry, which uses the [Cacheability
   * module](https://github.com/dylanaubrey/cacheability).
   */
  cacheability: Cacheability;
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

export interface Store {
  readonly maxHeapSize: number;
  readonly name: string;
  readonly type: string;
  clear(): Promise<void>;
  delete(key: string): Promise<boolean>;
  entries(keys?: string[]): Promise<Array<[string, any]>>;
  get(key: string): Promise<any>;
  has(key: string): Promise<boolean>;
  import(entries: Array<[string, any]>): Promise<void>;
  set(key: string, value: any): Promise<void>;
  size(): Promise<number>;
}

export interface StoreOptions {
  name: string;
}

export type StoreInit = (options: StoreOptions) => Promise<Store>;
