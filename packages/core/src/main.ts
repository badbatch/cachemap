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
  type ExportOptions,
  type ExportResult,
  type ImportOptions,
  type MethodOptions,
  type Options,
  type Reaper,
  type ReaperInit,
  type SetOptions,
} from './types.ts';

export class Core {
  public events = {
    ENTRY_DELETED: 'ENTRY_DELETED',
  };

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

  private _backupInterval: number = DEFAULT_BACKUP_INTERVAL;
  private _backupIntervalID?: ReturnType<typeof setTimeout>;
  private _backupStore?: BackupStore;
  private readonly _disableCacheInvalidation: boolean;
  private _emitter: EventEmitter = new EventEmitter();
  private readonly _encryptionSecret: string | undefined;
  private _maxHeapSize: number = DEFAULT_MAX_HEAP_SIZE;
  private _metadata: Metadata[] = [];
  private readonly _name: string;
  private _pendingWrites = new Map<string, Promise<void>>();
  private readonly _reaper?: Reaper;
  private readonly _sharedCache: boolean;
  private _store: Store = new MapStore();
  private readonly _type?: string;
  private _usedHeapSize = 0;
  private readonly _valueFormatting: ValueFormat = ValueFormat.String;

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
      onError,
      onReady,
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

    if (isFunction(reaper)) {
      this._reaper = this._initializeReaper(reaper);
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
      queueMicrotask(() => onReady?.());
      return;
    }

    void Promise.resolve(backupStoreInit({ name }))
      .then(async backupStore => {
        this._backupInterval = backupStore.backupInterval;
        this._backupStore = backupStore;
        this._maxHeapSize = backupStore.maxHeapSize;
        await this._retrieveMetadataFromBackupStore();

        if (hydrateFromBackupStore) {
          await this._retrieveEntriesFromBackupStore();
        }

        onReady?.();

        if (startBackup) {
          this.startBackup();
        }
      })
      .catch((error: unknown) => {
        onError?.(error);
      });
  }

  get backupStoreType(): string {
    return this._backupStore?.type ?? 'none';
  }

  public clear(): void {
    this._store.clear();
    this._metadata = [];
    this._usedHeapSize = 0;
    // We always want to clear the backup store if we
    // clear the local store.
    void this._backupStore?.clear();
  }

  public delete(rawKey: string, options: MethodOptions = {}): boolean {
    const errors: ArgsError[] = [];

    if (!isString(rawKey)) {
      errors.push(new ArgsError('@cachemap/core expected key to be a string.'));
    }

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core expected options to be a plain object.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core delete argument validation errors.', errors);
    }

    const key = this._resolveKey(rawKey, options);
    const deleted = this._store.delete(key);
    // We always want to delete from the backup store if we
    // delete from the local store.
    void this._backupStore?.delete(key);

    if (!deleted) {
      return false;
    }

    this._deleteMetadata(key);
    return true;
  }

  get emitter(): EventEmitter {
    return this._emitter;
  }

  public entries<T>(keys?: string[]): [string, T][] {
    this._validateEntryKeys(keys);
    return this._handleEntries(this._store.entries(this._getEntryKeys(keys)));
  }

  public async exists(rawKey: string, options: MethodOptions = {}): Promise<false | Cacheability> {
    const result = this.has(rawKey, options);

    if (result) {
      return result;
    }

    if (!this._backupStore) {
      throw new Error('@cachemap/core A backup store was not initialized.');
    }

    const key = this._resolveKey(rawKey, options);
    return this._handleHas(key, await this._backupStore.has(key));
  }

  public async export<T>(options: ExportOptions = {}): Promise<ExportResult<T>> {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core expected options to be an plain object.'));
    }

    if (options.keys && !isArray(options.keys)) {
      errors.push(new ArgsError('@cachemap/core expected options.keys to be an array.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core export argument validation errors.', errors);
    }

    const { cleanupTag, filterByValue, keys, tag } = options;
    let exportKeys: string[] | undefined;
    let metadata = [...this._metadata];

    if (tag) {
      metadata = this._metadata.filter(meta => meta.tags.includes(tag));
      exportKeys = metadata.map(meta => meta.key);

      if (cleanupTag) {
        this._cleanupTag(tag);
      }
    } else if (keys) {
      metadata = this._metadata.filter(meta => keys.includes(meta.key));
      exportKeys = keys;
    }

    let entries = await this.fetchEntries<T>(exportKeys);

    if (filterByValue) {
      const castFilterByValue = castArray(filterByValue);

      entries = entries.filter(([, data]) =>
        castFilterByValue.every(({ comparator, keyChain }) => get(data, keyChain) === comparator),
      );

      metadata = metadata.filter(meta => entries.some(([key]) => key === meta.key));
    }

    return {
      entries: entries.sort(([a], [b]) => a.localeCompare(b)),
      metadata: metadata.sort((a, b) => a.key.localeCompare(b.key)),
    };
  }

  public async fetch<T>(rawKey: string, options: MethodOptions = {}): Promise<T | undefined> {
    const result = this.get<T>(rawKey, options);

    if (result) {
      return result;
    }

    if (!this._backupStore) {
      throw new Error('@cachemap/core A backup store was not initialized.');
    }

    const key = this._resolveKey(rawKey, options);
    const pending = this._pendingWrites.get(key);

    if (pending) {
      await pending;
    }

    return this._handleGet<T>(key, await this._backupStore.get(key));
  }

  public async fetchEntries<T>(keys?: string[]): Promise<[string, T][]> {
    if (!this._backupStore) {
      throw new Error('@cachemap/core A backup store was not initialized.');
    }

    this._validateEntryKeys(keys);
    const entries = await this._backupStore.entries(this._getEntryKeys(keys));
    this._store.import(entries);
    return this._handleEntries(entries);
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
    return this._getMetadataEntry(options.hashKey ? Md5.hashStr(rawKey) : rawKey);
  }

  public has(rawKey: string, options: MethodOptions = {}): false | Cacheability {
    this._validateMethodArgs(rawKey, options);
    const key = options.hashKey ? Md5.hashStr(rawKey) : rawKey;

    if (this._hasCacheEntryExpired(key)) {
      this.delete(key);
      return false;
    }

    return this._handleHas(key, this._store.has(key));
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

    const entries = options.entries.map(
      // TypeScript is not seeing this as a string tuple.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      ([key, data]) => [key, prepareSetEntry(data, this._valueFormatting, this._encryptionSecret)] as [string, string],
    );

    this._store.import(entries);
    await this._backupStore?.import(entries);
    this._metadata = rehydrateMetadata([...filtered, ...options.metadata]);
    this._sortMetadata();
    this._updateHeapSize();
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

  public set(rawKey: string, value: unknown, options: SetOptions = {}): void {
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
    void this._enqueueWrite(key, preparedSetValue);

    if (exists) {
      this._updateMetadata(key, sizeOf(preparedSetValue), cacheability, options.tag, options.extensions);
    } else {
      this._addMetadata(key, sizeOf(preparedSetValue), cacheability, options.tag, options.extensions);
    }
  }

  get size(): number {
    return this._metadata.length;
  }

  public startBackup(): void {
    this._backupIntervalID = setInterval(() => {
      this._backupMetadata();
      this._storeEntriesToBackupStore();
    }, this._backupInterval);
  }

  public stopBackup(): void {
    if (this._backupIntervalID) {
      clearInterval(this._backupIntervalID);
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
      throw new Error('@cachemap/core A backup store was not initialized.');
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
    await this._enqueueWrite(key, preparedSetValue);

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

  private _backupMetadata(): void {
    if (!this._backupStore) {
      return;
    }

    void this._backupStore.set(
      constants.METADATA,
      // metadata is serializable as JSON.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      prepareSetEntry(dehydrateMetadata(this._metadata) as JsonValue, this._valueFormatting, this._encryptionSecret),
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

  private _deleteMetadata(key: string): void {
    const index = this._metadata.findIndex(metadata => metadata.key === key);

    if (index === -1) {
      return;
    }

    this._metadata.splice(index, 1);
    this._sortMetadata();
    this._updateHeapSize();
  }

  private _enqueueWrite(key: string, value: string): Promise<void> {
    if (!this._backupStore) {
      return Promise.resolve();
    }

    const backupStore = this._backupStore;
    const previousPendingWrite = this._pendingWrites.get(key) ?? Promise.resolve();

    const nextPendingWrite = previousPendingWrite
      .catch(() => {
        // swallow to keep chain alive
      })
      .then(() => backupStore.set(key, value));

    this._pendingWrites.set(key, nextPendingWrite);

    void nextPendingWrite.finally(() => {
      if (this._pendingWrites.get(key) === nextPendingWrite) {
        this._pendingWrites.delete(key);
      }
    });

    return nextPendingWrite;
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

  private _handleEntries<T>(entries: [string, string][]): [string, T][] {
    return entries
      .map(([key, data]): [string, T] => [key, prepareGetEntry<T>(data, this._valueFormatting, this._encryptionSecret)])
      .sort(([a], [b]) => a.localeCompare(b));
  }

  private _handleGet<T>(key: string, value?: string): T | undefined {
    if (!value) {
      return;
    }

    this._updateMetadata(key);
    return prepareGetEntry(value, this._valueFormatting, this._encryptionSecret);
  }

  private _handleHas(key: string, exists: boolean): false | Cacheability {
    if (!exists) {
      return false;
    }

    return this._getCacheability(key) ?? false;
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

  private _sortMetadata(): void {
    this._metadata.sort(Core._sortComparator);
  }

  private _storeEntriesToBackupStore(): void {
    if (!this._backupStore) {
      return;
    }

    const keys = this._metadata.map(entry => entry.key);
    void this._backupStore.import(this._store.entries(keys));
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
      throw new GroupedError('@cachemap/core get argument validation errors.', errors);
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
