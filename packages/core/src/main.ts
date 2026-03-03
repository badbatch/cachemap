import { instance } from '@cachemap/controller';
import { MapStore } from '@cachemap/map';
import { type BackupStore, type Metadata, type Store, type Tag } from '@cachemap/types';
import {
  ArgsError,
  GroupedError,
  ValueFormat,
  constants,
  dehydrateMetadata,
  isJsonValue,
  prepareGetEntry,
  prepareSetEntry,
  rehydrateMetadata,
  sizeOf,
} from '@cachemap/utils';
import { Cacheability } from 'cacheability';
import { EventEmitter } from 'eventemitter3';
import { castArray, get, isArray, isFunction, isPlainObject, isString, isUndefined } from 'lodash-es';
import { Md5 } from 'ts-md5';
import { type JsonValue } from 'type-fest';
import { DEFAULT_BACKUP_INTERVAL, DEFAULT_MAX_HEAP_SIZE } from './constants.ts';
import {
  type ControllerEvent,
  type EntriesOptions,
  type ExportOptions,
  type ExportResult,
  type ImportOptions,
  type MethodOptions,
  type Options,
  type Reaper,
  type ReaperInit,
  type SetOptions,
  type WriteOptions,
} from './types.ts';

export class Core {
  public events = {
    ENTRY_DELETED: 'ENTRY_DELETED',
  };

  public readonly ready: Promise<void>;

  private static _sortComparator = (a: Metadata, b: Metadata): number => {
    let index;

    if (a.accessedCount > b.accessedCount) {
      index = -1;
    } else if (a.accessedCount < b.accessedCount) {
      index = 1;
    } else if (a.lastAccessed > b.lastAccessed) {
      index = -1;
    } else if (a.lastAccessed < b.lastAccessed) {
      index = 1;
    } else if (a.lastUpdated > b.lastUpdated) {
      index = -1;
    } else if (a.lastUpdated < b.lastUpdated) {
      index = 1;
    } else if (a.added > b.added) {
      index = -1;
    } else if (a.added < b.added) {
      index = 1;
    } else if (a.size < b.size) {
      index = -1;
    } else if (a.size > b.size) {
      index = 1;
    } else {
      index = 0;
    }

    return index;
  };

  private _handleClearEvent = (event: ControllerEvent): void => {
    if (this._isControllerEventValid(event)) {
      this.clear();
    }
  };

  private _handleStartReaperEvent = (event: ControllerEvent): void => {
    if (this._isControllerEventValid(event)) {
      this._reaper?.start();
    }
  };

  private _handleStopReaperEvent = (event: ControllerEvent): void => {
    if (this._isControllerEventValid(event)) {
      this._reaper?.stop();
    }
  };

  private _handleStartBackupEvent = (event: ControllerEvent): void => {
    if (this._isControllerEventValid(event)) {
      this.startBackup();
    }
  };

  private _handleStopBackupEvent = (event: ControllerEvent): void => {
    if (this._isControllerEventValid(event)) {
      this.stopBackup();
    }
  };

  private _backupInProgress = false;
  private _backupInterval: number = DEFAULT_BACKUP_INTERVAL;
  private _backupIntervalID?: ReturnType<typeof setTimeout>;
  private _backupStore?: BackupStore;
  private readonly _disableCacheInvalidation: boolean;
  private _emitter: EventEmitter = new EventEmitter();
  private readonly _encryptionSecret: string | undefined;
  private _maxHeapSize: number = DEFAULT_MAX_HEAP_SIZE;
  private _metadata: Metadata[] = [];
  private readonly _name: string;
  private _onBackupError?: (error: unknown) => void;
  private _pendingWrites = new Map<string, Promise<unknown>>();
  private readonly _reaper?: Reaper;
  private readonly _sharedCache: boolean;
  private _store: Store = new MapStore();
  private readonly _type?: string;
  private _usedHeapSize = 0;
  private readonly _valueFormatting: ValueFormat = ValueFormat.String;
  private _writeVersion = 0;

  constructor(options: Options) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core expected options to be a plain object.'));
    }

    if (!isString(options.name)) {
      errors.push(new ArgsError('@cachemap/core expected options.name to be a string.'));
    }

    if (options.backupStore && !isFunction(options.backupStore)) {
      errors.push(new ArgsError('@cachemap/core expected options.backupStore to be a function.'));
    }

    if (options.valueFormatting === ValueFormat.Encrypt && !options.encryptionSecret) {
      errors.push(
        new ArgsError('@cachemap/core expected encryptionSecret to be set when valueFormatting is "encrypt"'),
      );
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core constructor argument validation errors.', errors);
    }

    const {
      backupStore: backupStoreInit,
      disableCacheInvalidation = false,
      encryptionSecret,
      hydrateFromBackupStore,
      name,
      onBackupError,
      onError,
      reaper,
      sharedCache = false,
      sortComparator,
      startBackup,
      type,
      valueFormatting,
    } = options;

    this._disableCacheInvalidation = disableCacheInvalidation;

    if (isString(encryptionSecret)) {
      this._encryptionSecret = encryptionSecret;
    }

    this._name = name;

    if (isFunction(onBackupError)) {
      this._onBackupError = onBackupError;
    }

    if (isFunction(reaper)) {
      try {
        this._reaper = this._initializeReaper(reaper);
      } catch (error) {
        onError?.({ error, type: 'reaper' });
      }
    }

    this._sharedCache = sharedCache;

    if (isFunction(sortComparator)) {
      Core._sortComparator = sortComparator;
    }

    if (isString(type)) {
      this._type = type;
    }

    if (valueFormatting) {
      this._valueFormatting = valueFormatting;
    }

    this._addControllerEventListeners();

    if (!backupStoreInit) {
      this.ready = Promise.resolve();
      return;
    }

    this.ready = Promise.resolve(backupStoreInit({ name }))
      .then(async backupStore => {
        this._backupInterval = backupStore.backupInterval;
        this._backupStore = backupStore;
        this._maxHeapSize = backupStore.maxHeapSize;
        await this._retrieveMetadataFromBackupStore();

        if (hydrateFromBackupStore) {
          await this._retrieveEntriesFromBackupStore();
        }

        if (startBackup) {
          this.startBackup();
        }
      })
      .catch((error: unknown) => {
        onError?.({ error, type: 'backupStore' });
        throw error;
      });
  }

  get backupStoreType(): string {
    return this._backupStore?.type ?? 'none';
  }

  public clear(): void {
    this._store.clear();
    this._metadata = [];
    this._usedHeapSize = 0;
    this._pendingWrites.clear();
    this._writeVersion++;
    void this.ready.then(() => this._backupStore?.clear());
  }

  public delete(rawKey: string, options: WriteOptions = {}): boolean {
    this._validateMethodArgs(rawKey, options);
    const key = this._resolveKey(rawKey, options);
    return this._deleteByResolvedKey(key, options);
  }

  get emitter(): EventEmitter {
    return this._emitter;
  }

  public entries<T>(rawKeys?: string[], options: EntriesOptions = {}): [string, T][] {
    this._validateEntryKeys(rawKeys);
    const keys = this._getEntryKeys(rawKeys);
    const { entries } = this._filterValidEntries(keys);
    return this._handleEntries<T>(entries, options);
  }

  public async exists(rawKey: string, options: MethodOptions = {}): Promise<boolean> {
    this._validateMethodArgs(rawKey, options);
    const key = this._resolveKey(rawKey, options);

    if (this._store.has(key)) {
      if (!this._hasCacheEntryExpired(key)) {
        return true;
      }

      this._deleteLocalByResolvedKey(key);
    }

    if (!this._backupStore) {
      throw new Error('@cachemap/core A backup store does not exist.');
    }

    await this.ready;
    const pending = this._pendingWrites.get(key);

    if (pending) {
      await pending;
    }

    return this._backupStore.has(key);
  }

  public async export<T>(options: ExportOptions = {}): Promise<ExportResult<T>> {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core expected options to be a plain object.'));
    }

    if (options.keys && !isArray(options.keys)) {
      errors.push(new ArgsError('@cachemap/core expected options.keys to be an array.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core export argument validation errors.', errors);
    }

    const { cleanupTag, filterByValue, keys, sort, tag } = options;
    let exportKeys: string[] | undefined;
    let metadata = [...this._metadata];

    if (tag) {
      metadata = this._metadata.filter(meta => meta.tags.includes(tag));
      exportKeys = metadata.map(meta => meta.key);
    } else if (keys) {
      const keySet = new Set(keys);
      metadata = this._metadata.filter(meta => keySet.has(meta.key));
      exportKeys = keys;
    }

    let entries = await this.fetchEntries<T>(exportKeys);

    if (filterByValue) {
      const castFilterByValue = castArray(filterByValue);

      entries = entries.filter(([, data]) =>
        castFilterByValue.every(({ comparator, keyChain }) => get(data, keyChain) === comparator),
      );

      const entryKeySet = new Set(entries.map(([key]) => key));
      metadata = metadata.filter(meta => entryKeySet.has(meta.key));
    }

    if (sort) {
      entries.sort(([a], [b]) => a.localeCompare(b));
      metadata.sort((a, b) => a.key.localeCompare(b.key));
    }

    if (tag && cleanupTag) {
      this._cleanupTag(tag);
    }

    return {
      entries,
      metadata,
    };
  }

  public async fetch<T>(rawKey: string, options: MethodOptions = {}): Promise<T | undefined> {
    this._validateMethodArgs(rawKey, options);
    const key = this._resolveKey(rawKey, options);
    const result = this._store.get(key);

    if (result !== undefined) {
      if (!this._hasCacheEntryExpired(key)) {
        return this._handleGet<T>(key, result);
      }

      this._deleteLocalByResolvedKey(key);
    }

    if (!this._backupStore) {
      throw new Error('@cachemap/core A backup store does not exist.');
    }

    await this.ready;
    const pending = this._pendingWrites.get(key);

    if (pending) {
      await pending;
    }

    return this._handleGet<T>(key, await this._backupStore.get(key));
  }

  public async fetchEntries<T>(rawKeys?: string[], options: EntriesOptions = {}): Promise<[string, T][]> {
    this._validateEntryKeys(rawKeys);
    const keys = this._getEntryKeys(rawKeys);
    const { entries: localEntries, missingKeys } = this._filterValidEntries(keys);

    if (missingKeys.length === 0) {
      return this._handleEntries<T>(localEntries, options);
    }

    if (!this._backupStore) {
      throw new Error('@cachemap/core A backup store does not exist.');
    }

    await this.ready;
    await Promise.all(missingKeys.map(key => this._pendingWrites.get(key) ?? Promise.resolve()));
    const { entries: refreshedLocalEntries, missingKeys: refreshedMissingKeys } = this._filterValidEntries(missingKeys);
    const entries = await this._backupStore.entries(refreshedMissingKeys);
    const map = new Map([...localEntries, ...refreshedLocalEntries, ...entries]);
    const combinedEntries = [...map.entries()];
    this._store.import(entries);
    return this._handleEntries<T>(combinedEntries, options);
  }

  public async flush(): Promise<void> {
    if (!this._backupStore) {
      throw new Error('@cachemap/core A backup store does not exist.');
    }

    await this.ready;
    this._writeVersion++;
    await Promise.all(this._pendingWrites.values());
    await this._backupStore.clear();
    this._store.clear();
    this._metadata = [];
    this._usedHeapSize = 0;
    this._pendingWrites.clear();
  }

  public get<T>(rawKey: string, options: MethodOptions = {}): T | undefined {
    this._validateMethodArgs(rawKey, options);
    const key = this._resolveKey(rawKey, options);

    if (this._hasCacheEntryExpired(key)) {
      this.delete(key);
      return;
    }

    return this._handleGet(key, this._store.get(key));
  }

  public getMetadataEntry(rawKey: string, options: MethodOptions = {}): Metadata | undefined {
    return this._getMetadataEntry(this._resolveKey(rawKey, options));
  }

  public has(rawKey: string, options: MethodOptions = {}): boolean {
    this._validateMethodArgs(rawKey, options);
    const key = this._resolveKey(rawKey, options);

    if (!this._store.has(key)) {
      return false;
    }

    if (this._hasCacheEntryExpired(key)) {
      this._deleteByResolvedKey(key);
      return false;
    }

    return true;
  }

  public async import(options: ImportOptions): Promise<void> {
    if (!isPlainObject(options)) {
      throw new ArgsError('@cachemap/core expected options to be a plain object.');
    }

    const errors: ArgsError[] = [];

    if (!isArray(options.entries)) {
      errors.push(new ArgsError('@cachemap/core expected entries to be an array.'));
    }

    if (!isArray(options.metadata)) {
      errors.push(new ArgsError('@cachemap/core expected metadata to be an array.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core has argument validation errors.', errors);
    }

    let filtered: Metadata[] = [];

    if (this._metadata.length > 0) {
      filtered = this._metadata.filter(metadata => {
        return !options.metadata.some(optionsMetadata => metadata.key === optionsMetadata.key);
      });
    }

    const entries: [string, string][] = options.entries.map(([key, data]) => [
      key,
      prepareSetEntry(data, this._valueFormatting, this._encryptionSecret),
    ]);

    await this.ready;
    await Promise.all(this._pendingWrites.values());
    this._store.import(entries);
    this._metadata = rehydrateMetadata([...filtered, ...options.metadata]);
    this._sortMetadata();
    this._updateHeapSize();
    await this._backupStore?.import(entries);
  }

  get metadata(): Metadata[] {
    return this._metadata;
  }

  get name(): string {
    return this._name;
  }

  get reaper(): Reaper | undefined {
    return this._reaper;
  }

  public async remove(rawKey: string, options: WriteOptions = {}): Promise<boolean> {
    this._validateMethodArgs(rawKey, options);
    const key = this._resolveKey(rawKey, options);
    const onWrite = (backupStore: BackupStore): Promise<boolean> => backupStore.delete(key);
    const deleted = await this._enqueueWrite(key, onWrite, options.onWriteError);

    if (!deleted) {
      return false;
    }

    this._store.delete(key);
    this._deleteMetadata(key);
    return true;
  }

  public set(rawKey: string, value: unknown, options: SetOptions = {}): void {
    // validateSetArgs throws, but includes type guard on value param
    // to aid typing, hence the early return.
    if (!this._validateSetArgs(rawKey, value, options)) {
      return;
    }

    const cacheability = new Cacheability(options.cacheOptions);
    const { cacheControl } = cacheability.metadata;

    if (cacheControl.noStore || (this._sharedCache && cacheControl.private)) {
      return;
    }

    const key = this._resolveKey(rawKey, options);
    const preparedSetValue = prepareSetEntry(value, this._valueFormatting, this._encryptionSecret);
    this._store.set(key, preparedSetValue);
    const onWrite = (backupStore: BackupStore): Promise<void> => backupStore.set(key, preparedSetValue);
    void this._enqueueWrite(key, onWrite, options.onWriteError);
    const size = sizeOf(preparedSetValue);

    if (this._getMetadataEntry(key)) {
      this._updateMetadata(key, size, cacheability, options.tag, options.extensions);
    } else {
      this._addMetadata(key, size, cacheability, options.tag, options.extensions);
    }
  }

  get size(): number {
    return this._metadata.length;
  }

  public startBackup(): void {
    this._backupIntervalID = setInterval(() => {
      void this._runBackup();
    }, this._backupInterval);
  }

  public stopBackup(): void {
    if (this._backupIntervalID) {
      clearInterval(this._backupIntervalID);
      this._backupIntervalID = undefined;
    }
  }

  get type(): string | undefined {
    return this._type;
  }

  get usedHeapSize(): number {
    return this._usedHeapSize;
  }

  public async write(rawKey: string, value: unknown, options: SetOptions = {}): Promise<void> {
    if (!this._backupStore) {
      throw new Error('@cachemap/core A backup store does not exist.');
    }

    if (!this._validateSetArgs(rawKey, value, options)) {
      return;
    }

    const cacheability = new Cacheability(options.cacheOptions);
    const { cacheControl } = cacheability.metadata;

    if (cacheControl.noStore || (this._sharedCache && cacheControl.private)) {
      return;
    }

    const key = options.hashKey ? Md5.hashStr(rawKey) : rawKey;
    const exists = !!this._getMetadataEntry(key);
    const preparedSetValue = prepareSetEntry(value, this._valueFormatting, this._encryptionSecret);
    this._store.set(key, preparedSetValue);
    const onWrite = (backupStore: BackupStore): Promise<void> => backupStore.set(key, preparedSetValue);
    await this._enqueueWrite(key, onWrite, options.onWriteError);

    if (exists) {
      this._updateMetadata(key, sizeOf(preparedSetValue), cacheability, options.tag, options.extensions);
    } else {
      this._addMetadata(key, sizeOf(preparedSetValue), cacheability, options.tag, options.extensions);
    }
  }

  private _addControllerEventListeners(): void {
    instance.on(constants.CLEAR, this._handleClearEvent);
    instance.on(constants.START_REAPER, this._handleStartReaperEvent);
    instance.on(constants.STOP_REAPER, this._handleStopReaperEvent);
    instance.on(constants.START_BACKUP, this._handleStartBackupEvent);
    instance.on(constants.STOP_BACKUP, this._handleStopBackupEvent);
  }

  private _addMetadata(
    key: string,
    size: number,
    cacheability: Cacheability,
    tag?: Tag,
    extensions?: Record<string, unknown>,
  ): void {
    this._metadata.push({
      accessedCount: 0,
      added: Date.now(),
      cacheability,
      extensions,
      key,
      lastAccessed: Date.now(),
      lastUpdated: Date.now(),
      size,
      tags: tag ? [tag] : [],
      updatedCount: 0,
    });

    this._sortMetadata();
    this._updateHeapSize();
  }

  private async _backupMetadata(metadata: Metadata[]): Promise<void> {
    if (!this._backupStore) {
      return;
    }

    await this._backupStore.set(
      constants.METADATA,
      // metadata is serializable as JSON.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      prepareSetEntry(dehydrateMetadata(metadata) as JsonValue, this._valueFormatting, this._encryptionSecret),
    );
  }

  private _calcReductionChunk(): number | undefined {
    const reductionSize = Math.round(this._maxHeapSize * 0.2);
    let chunkSize = 0;
    let chunk: number | undefined;

    for (let index = this._metadata.length - 1; index >= 0; index -= 1) {
      // Based on surrounding code context, this cannot be undefined.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      chunkSize += this._metadata[index]!.size;

      if (chunkSize > reductionSize) {
        chunk = index;
        break;
      }
    }

    return chunk;
  }

  private _cleanupTag(tag: string | number): void {
    for (const entry of this._metadata) {
      if (entry.tags.includes(tag)) {
        entry.tags = entry.tags.filter(t => t !== tag);
      }
    }
  }

  private _deleteByResolvedKey(key: string, options?: WriteOptions): boolean {
    if (!this._store.delete(key)) {
      return false;
    }

    const onWrite = (backupStore: BackupStore): Promise<boolean> => backupStore.delete(key);
    void this._enqueueWrite(key, onWrite, options?.onWriteError);
    this._deleteMetadata(key);
    return true;
  }

  private _deleteLocalByResolvedKey(key: string): boolean {
    if (!this._store.delete(key)) {
      return false;
    }

    this._deleteMetadata(key);
    return true;
  }

  private _deleteMetadata(key: string): void {
    const index = this._metadata.findIndex(metadata => metadata.key === key);

    if (index === -1) {
      return;
    }

    this._metadata.splice(index, 1);
    this._sortMetadata();
    this._updateHeapSize();
  }

  private _enqueueWrite<T>(
    key: string,
    onWrite: (backupStore: BackupStore) => Promise<T>,
    onWriteError?: (error: unknown) => void,
  ): Promise<T | undefined> {
    if (!this._backupStore) {
      // Required for type consistency
      // eslint-disable-next-line unicorn/no-useless-undefined
      return Promise.resolve(undefined);
    }

    const backupStore = this._backupStore;
    const previousPendingWrite = this._pendingWrites.get(key) ?? Promise.resolve();
    const version = this._writeVersion;

    const safePrevious = previousPendingWrite.catch((error: unknown) => {
      onWriteError?.(error);
    });

    const nextPendingWrite = safePrevious.then((): Promise<T> | undefined => {
      if (version !== this._writeVersion) {
        return;
      }

      return onWrite(backupStore);
    });

    this._pendingWrites.set(key, nextPendingWrite);

    void nextPendingWrite.finally(() => {
      if (this._pendingWrites.get(key) === nextPendingWrite) {
        this._pendingWrites.delete(key);
      }
    });

    return nextPendingWrite;
  }

  private _filterValidEntries(keys: string[]): { entries: [string, string][]; missingKeys: string[] } {
    const entries = this._store.entries(keys).filter(([key]) => {
      if (this._hasCacheEntryExpired(key)) {
        this._deleteLocalByResolvedKey(key);
        return false;
      }

      return true;
    });

    const keySet = new Set(entries.map(([key]) => key));
    const missingKeys = keys.filter(k => !keySet.has(k));

    return {
      entries,
      missingKeys,
    };
  }

  private _getCacheability(key: string): Cacheability | undefined {
    const metadata = this._getMetadataEntry(key);
    return metadata ? metadata.cacheability : undefined;
  }

  private _getEntryKeys(keys?: string[]): string[] {
    return keys ?? this._metadata.map(metadata => metadata.key);
  }

  private _getMetadataEntry(key: string): Metadata | undefined {
    return this._metadata.find(metadata => metadata.key === key);
  }

  private _handleEntries<T>(entries: [string, string][], options: EntriesOptions): [string, T][] {
    const result = entries.map(([key, data]): [string, T] => [
      key,
      prepareGetEntry<T>(data, this._valueFormatting, this._encryptionSecret),
    ]);

    if (!options.sort) {
      return result;
    }

    return result.sort(([a], [b]) => a.localeCompare(b));
  }

  private _handleGet<T>(key: string, value?: string): T | undefined {
    if (value === undefined) {
      return;
    }

    this._updateMetadata(key);
    return prepareGetEntry(value, this._valueFormatting, this._encryptionSecret);
  }

  private _hasCacheEntryExpired(key: string): boolean {
    if (this._disableCacheInvalidation) {
      return false;
    }

    const cacheability = this._getCacheability(key);
    return cacheability ? !cacheability.checkTTL() : false;
  }

  private _initializeReaper(reaperInit: ReaperInit): Reaper {
    return reaperInit({
      deleteCallback: (key: string, tags?: Tag[]) => {
        this.emitter.emit(this.events.ENTRY_DELETED, { deleted: this.delete(key), key, tags });
      },
      metadataCallback: () => this._metadata,
    });
  }

  private _isControllerEventValid({ name, type }: ControllerEvent): boolean {
    return (isString(name) && name === this._name) || (isString(type) && type === this._type);
  }

  private _reduceHeapSize(): void {
    const index = this._calcReductionChunk();

    if (!index || !this._reaper) {
      return;
    }

    void this._reaper.cull(this._metadata.slice(index));
  }

  private _resolveKey(key: string, options: MethodOptions): string {
    return options.hashKey ? Md5.hashStr(key) : key;
  }

  private async _retrieveEntriesFromBackupStore(): Promise<void> {
    if (!this._backupStore) {
      return;
    }

    if (this._metadata.length > 0) {
      const keys = this._metadata.map(entry => entry.key);
      this._store.import(await this._backupStore.entries(keys));
    }
  }

  private async _retrieveMetadataFromBackupStore(): Promise<void> {
    if (!this._backupStore) {
      return;
    }

    const metadata = await this._backupStore.get(constants.METADATA);

    if (metadata) {
      this._metadata = rehydrateMetadata(prepareGetEntry(metadata, this._valueFormatting, this._encryptionSecret));
    }
  }

  private async _runBackup(): Promise<void> {
    if (!this._backupStore || this._backupInProgress) {
      return;
    }

    this._backupInProgress = true;

    try {
      const snapshot = [...this._metadata];
      await this._storeEntriesToBackupStore(snapshot);
      await this._backupMetadata(snapshot);
    } finally {
      this._backupInProgress = false;
    }
  }

  private _sortMetadata(): void {
    this._metadata.sort(Core._sortComparator);
  }

  private async _storeEntriesToBackupStore(metadata: Metadata[]): Promise<void> {
    if (!this._backupStore) {
      return;
    }

    const keys = metadata.map(entry => entry.key);

    try {
      await this._backupStore.import(this._store.entries(keys));
    } catch (error) {
      this._onBackupError?.(error);
    }
  }

  private _updateHeapSize(): void {
    this._usedHeapSize = this._metadata.reduce((acc, value) => acc + value.size, 0);

    if (!this._disableCacheInvalidation && this._usedHeapSize > this._maxHeapSize) {
      this._reduceHeapSize();
    }
  }

  private _updateMetadata(
    key: string,
    size?: number,
    cacheability?: Cacheability,
    tag?: Tag,
    extensions?: Record<string, unknown>,
  ): void {
    const entry = this._getMetadataEntry(key);

    if (!entry) {
      return;
    }

    if (size) {
      entry.size = size;
      entry.lastUpdated = Date.now();
      entry.updatedCount += 1;
    } else {
      entry.accessedCount += 1;
      entry.lastAccessed = Date.now();
    }

    if (cacheability) {
      entry.cacheability = cacheability;
    }

    if (!isUndefined(tag)) {
      entry.tags.push(tag);
    }

    if (extensions) {
      entry.extensions = Object.assign(entry.extensions ?? {}, extensions);
    }

    this._sortMetadata();
    this._updateHeapSize();
  }

  private _validateEntryKeys(keys?: string[]): void {
    if (keys && !isArray(keys)) {
      throw new ArgsError('@cachemap/core expected keys to be an array.');
    }
  }

  private _validateMethodArgs(key: string, options: MethodOptions): void {
    const errors: ArgsError[] = [];

    if (!isString(key)) {
      errors.push(new ArgsError('@cachemap/core expected key to be a string.'));
    }

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core expected options to be a plain object.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core argument validation errors.', errors);
    }
  }

  private _validateSetArgs(key: string, value: unknown, options: SetOptions): value is JsonValue {
    const errors: ArgsError[] = [];

    if (!isString(key)) {
      errors.push(new ArgsError('@cachemap/core expected key to be a string.'));
    }

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core expected options to be a plain object.'));
    }

    if (!isJsonValue(value)) {
      errors.push(new ArgsError('@cachemap/core expected value to be JSON serializable.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core set argument validation errors.', errors);
    }

    return true;
  }
}
