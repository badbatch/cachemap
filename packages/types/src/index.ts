import { type Cacheability, type Metadata as CacheabilityMetadata } from 'cacheability';

export type BaseMetadata = {
  [index: string]: unknown;
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
  tags: Tag[];

  /**
   * The number of times the corresponding data
   * entry has been updated.
   */
  updatedCount: number;
};

export type DehydratedMetadata = BaseMetadata & {
  cacheability: { metadata: CacheabilityMetadata };
};

export type Metadata = BaseMetadata & {
  /**
   * The cache information of the corresponding
   * data entry, which uses the [Cacheability
   * module](https://github.com/dylanaubrey/cacheability).
   */
  cacheability: Cacheability;
};

export interface Store {
  clear(): Promise<void>;
  delete(key: string): Promise<boolean>;
  entries(keys?: string[], options?: { allKeys?: string[] }): Promise<[string, string][]>;
  get(key: string): Promise<string | undefined>;
  has(key: string): Promise<boolean>;
  import(entries: [string, string][]): Promise<void>;
  readonly maxHeapSize: number;
  readonly name: string;
  set(key: string, value: string): Promise<void>;
  size(): Promise<number>;
  readonly type: string;
}

export interface StoreOptions {
  name: string;
}

export type StoreInit = (options: StoreOptions) => Promise<Store> | Store;

export type Tag = string | number;
