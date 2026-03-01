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

export type Metadata = BaseMetadata & {
  /**
   * The cache information of the corresponding
   * data entry, which uses the [Cacheability
   * module](https://github.com/badbatch/cacheability).
   */
  cacheability: Cacheability;
};

export interface BackupStore {
  backupInterval: number;
  clear(): Promise<void>;
  delete(key: string): Promise<boolean>;
  entries(keys: string[]): Promise<[string, string][]>;
  get(key: string): Promise<string | undefined>;
  has(key: string): Promise<boolean>;
  import(entries: [string, string][]): Promise<void>;
  readonly maxHeapSize: number;
  readonly name: string;
  set(key: string, value: string): Promise<void>;
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
}

export interface BackupStoreOptions {
  /**
   * The time in milliseconds between backups from a map store
   * to the provided persisted store.
   */
  backupInterval?: number;
  name: string;
}

export type Tag = string | number;
