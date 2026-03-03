import { type BackupStoreInit, type Metadata, type Tag } from '@cachemap/types';
import { type ValueFormat } from '@cachemap/utils';
import { type CacheabilityArgs } from 'cacheability';
import { type JsonValue } from 'type-fest';

export interface ControllerEvent {
  name?: string;
  type?: string;
}

export interface FilterByValue {
  comparator: unknown;
  keyChain: string;
}

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

export interface ImportOptions {
  entries: [string, JsonValue][];
  metadata: Metadata[];
}

export type MethodName = 'clear' | 'delete' | 'entries' | 'export' | 'get' | 'has' | 'import' | 'set' | 'size';

export interface MethodOptions {
  hashKey?: boolean;
}

export interface Options {
  /**
   * Whether to use store to back up to from a map store. If true,
   * the provided store is used to periodically back up to rather than
   * directly write to. This makes reading/writing much quicker, but
   * still gives you persistence across browser reloads or server
   * restarts. If true, the store should be a persisted store.
   */
  backupStore?: BackupStoreInit;
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
   * Whether to retrieve all data from backup store on initialization.
   */
  hydrateFromBackupStore?: boolean;
  /**
   * The name is primarily used as a target for the controller, in order
   * to centrally control the cachemap in an application with multiple
   * instances.
   */
  name: string;
  /**
   * Callback that will execute if the backup store import fails.
   */
  onBackupError?: (error: unknown) => void;
  /**
   * Callback that will execute if the initialization of the backup store fails.
   */
  onError?: (params: { error: unknown; type: 'backupStore' | 'reaper' }) => void;
  /**
   * The reaper is used to keep the cachemap size below user specified limits
   * by purging the least important entries in the cachemap.
   */
  reaper?: ReaperInit;
  /**
   * Whether the cache is shared. If true, entries with a cache control
   * header of "private" are not stored in the cachemap.
   */
  sharedCache?: boolean;
  /**
   * The sort comparator is used to order cachemap entries by importance so the
   * reaper knows what entries to purge first.
   */
  sortComparator?: (a: Metadata, b: Metadata) => number;
  /**
   * Whether to start backing up store on initialisation. If set to false,
   * you would be triggering the backup through the controller.
   */
  startBackup?: boolean;
  /**
   * The type is primarily used as a target for the controller, in order
   * to centrally control a group of cachemaps in an application with multiple
   * instances.
   */
  type?: string;
  /**
   * The format the value is written into storage.
   * Default is ValueFormat.String
   */
  valueFormatting?: ValueFormat;
}

export interface Reaper {
  cull(metadata: Metadata[]): Promise<void>;
  start(): void;
  stop(): void;
}

export interface ReaperCallbacks {
  deleteCallback: (key: string, tags?: Tag[]) => void;
  metadataCallback: () => Metadata[];
}

export type ReaperInit = (callbacks: ReaperCallbacks) => Reaper;

export interface SetOptions extends WriteOptions {
  cacheOptions?: CacheabilityArgs;
  extensions?: Record<string, unknown>;
  hashKey?: boolean;
  onWriteError?: (error: unknown) => void;
  tag?: Tag;
}

export interface WriteOptions extends MethodOptions {
  onWriteError?: (error: unknown) => void;
}
