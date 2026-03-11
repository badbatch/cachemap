import { type Cacheability, type CacheabilityArgs, type Metadata as CacheabilityMetadata } from 'cacheability';
import { type JsonValue } from 'type-fest';

export interface BackupStore {
  clear(): Promise<void>;
  delete(key: string): Promise<boolean>;
  entries(keys: string[]): Promise<[string, string][]>;
  get(key: string): Promise<string | undefined>;
  has(key: string): Promise<boolean>;
  import(entries: [string, string][]): Promise<void>;
  readonly name: string;
  set(key: string, value: string): Promise<void>;
  size(): Promise<number>;
  readonly type: string;
}

export type BackupStoreInit = (options: BackupStoreOptions) => Promise<BackupStore>;

export interface Store {
  clear(): void;
  delete(key: string): boolean;
  entries(keys: string[]): [string, string][];
  get(key: string): string | undefined;
  has(key: string): boolean;
  import(entries: [string, string][]): void;
  set(key: string, value: string): void;
  size: number;
}

export interface BackupStoreOptions {
  /**
   * The time in milliseconds between backups from a map store
   * to the provided persisted store.
   */
  name: string;
}

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
   * A property to store any custom metadata. The data must
   * be JSON serializable.
   */
  extensions?: Record<string, unknown>;

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

export interface EntriesOptions {
  sort?: boolean;
}

export interface ExportOptions {
  /**
   * If a tag is provided, cleanupTag removes the tag from
   * each cache entries' metadata in which it is found.
   */
  cleanupTag?: boolean;
  filterByValue?: FilterByValue | FilterByValue[];
  keys?: string[];
  sort?: boolean;
  tag?: Tag;
}

export type ExportResult<T> = {
  entries: [string, T][];
  metadata: Metadata[];
};

export interface FilterByValue {
  comparator: unknown;
  keyChain: string;
}

export interface ImportOptions {
  entries: [string, JsonValue][];
  metadata: Metadata[];
}

export interface MethodOptions {
  hashKey?: boolean;
}

export type Metadata = BaseMetadata & {
  /**
   * The cache information of the corresponding
   * data entry, which uses the [Cacheability
   * module](https://github.com/badbatch/cacheability).
   */
  cacheability: Cacheability;
};

export interface SetOptions extends WriteOptions {
  cacheOptions?: CacheabilityArgs;
  extensions?: Record<string, unknown>;
  hashKey?: boolean;
  onWriteError?: (error: unknown) => void;
  tag?: Tag;
}

export type Tag = string | number;

export interface WriteOptions extends MethodOptions {
  onWriteError?: (error: unknown) => void;
}
