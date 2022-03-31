import Cacheability from "cacheability";

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

export interface Metadata extends BaseMetadata {
  /**
   * The cache information of the corresponding
   * data entry, which uses the [Cacheability
   * module](https://github.com/dylanaubrey/cacheability).
   */
  cacheability: Cacheability;
}

export interface Store {
  readonly maxHeapSize: number;
  readonly name: string;
  readonly type: string;
  clear(): Promise<void>;
  delete(key: string): Promise<boolean>;
  entries(keys?: string[], options?: { allKeys?: string[] }): Promise<[string, any][]>;
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
