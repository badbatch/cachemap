import Cacheability from "cacheability";
import { ReaperWrapper } from "../reaper";

export interface CacheHeaders {
  cacheControl?: string;
  etag?: string;
}

export interface ConstructorOptions extends InitOptions {
  store: Store;
}

export interface DehydratedMetadata extends Metadata {
  cacheability: { metadata: CacheabilityMetadata };
}

export interface ExportResult {
  entries: Array<[string, any]>;
  metadata: Metadata[];
}

export interface ImportOptions {
  entries: Array<[string, any]>;
  metadata: Metadata[];
}

export interface InitOptions {
  disableCacheInvalidation?: boolean;
  name: string;
  reaper?: ReaperWrapper;
  sharedCache?: boolean;
  store: StoreWrapper;
  sortComparator?(a: any, b: any): number;
}

export interface Metadata {
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
   * The cache information of the corresponding
   * data entry, which uses the [Cacheability
   * module](https://github.com/dylanaubrey/cacheability).
   */
  cacheability: Cacheability;

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

export interface PlainObject {
  [key: string]: any;
}

export interface Store {
  readonly maxHeapSize: number;
  public async clear(): Promise<void>;
  public async delete(key: string): Promise<boolean>;
  public async entries(keys?: string[]): Promise<Array<[string, any]>>;
  public async get(key: string): Promise<any>;
  public async has(key: string): Promise<boolean>;
  public async import(entries: Array<[string, any]>): Promise<void>;
  public async set(key: string, value: any): Promise<void>;
  public async size(): Promise<number>;
}

export type StoreWrapper = (...args: any[]) => Promise<Store>;
