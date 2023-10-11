import { instance } from '@cachemap/controller';
import { MapStore } from '@cachemap/map';
import { type DehydratedMetadata, type Metadata, type Store, type Tag } from '@cachemap/types';
import {
  ArgsError,
  GroupedError,
  PositionError,
  constants,
  dehydrateMetadata,
  isJsonValue,
  prepareGetEntry,
  prepareSetEntry,
  rehydrateMetadata,
  sizeOf,
} from '@cachemap/utils';
import { Cacheability } from 'cacheability';
import EventEmitter from 'eventemitter3';
import { castArray, get, isArray, isFunction, isNumber, isPlainObject, isString, isUndefined } from 'lodash-es';
import { Md5 } from 'ts-md5';
import type { JsonValue } from 'type-fest';
import { DEFAULT_BACKUP_INTERVAL, DEFAULT_MAX_HEAP_SIZE } from '../constants.ts';
import {
  type CacheHeaders,
  type ConstructorOptions,
  type ControllerEvent,
  type ExportOptions,
  type ExportResult,
  type FilterByValue,
  type ImportOptions,
  type MethodName,
  type Reaper,
  type ReaperInit,
  type RequestQueue,
} from '../types.ts';

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

  private _handleClearEvent = ({ name, type }: ControllerEvent): void => {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      void this._clear();
    }
  };

  private _handleStartReaperEvent = ({ name, type }: ControllerEvent): void => {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._reaper?.start();
    }
  };

  private _handleStopReaperEvent = ({ name, type }: ControllerEvent): void => {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._reaper?.stop();
    }
  };

  private _handleStartBackupEvent = ({ name, type }: ControllerEvent): void => {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._startBackup();
    }
  };

  private _handleStopBackupEvent = ({ name, type }: ControllerEvent): void => {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._stopBackup();
    }
  };

  private _backupInterval: number = DEFAULT_BACKUP_INTERVAL;
  private _backupIntervalID?: NodeJS.Timer;
  private _backupStore?: Store;
  private _disableCacheInvalidation: boolean;
  private _emitter: EventEmitter = new EventEmitter();
  private _encryptionSecret: string | undefined;
  private _maxHeapSize: number = DEFAULT_MAX_HEAP_SIZE;
  private _metadata: Metadata[] = [];
  private _name: string;
  private _persistedStore = true;
  private _processing: string[] = [];
  private _ready = false;
  private _reaper?: Reaper;
  private _requestQueue: RequestQueue = [];
  private _sharedCache: boolean;
  private _store?: Store;
  private _type: string;
  private _usedHeapSize = 0;

  constructor(options: ConstructorOptions) {
    const errors: ArgsError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core expected options to be a plain object.'));
    }

    if (!isString(options.name)) {
      errors.push(new ArgsError('@cachemap/core expected options.name to be a string.'));
    }

    if (!isFunction(options.store)) {
      errors.push(new ArgsError('@cachemap/core expected options.store to be a function.'));
    }

    if (!isString(options.type)) {
      errors.push(new ArgsError('@cachemap/core expected options.type to be a string.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core constructor argument validation errors.', errors);
    }

    const {
      backupInterval,
      backupStore,
      disableCacheInvalidation = false,
      encryptionSecret,
      name,
      reaper,
      sharedCache = false,
      sortComparator,
      startBackup,
      store: storeInit,
      type,
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

    this._type = type;
    this._addControllerEventListeners();

    void Promise.resolve(storeInit({ name: name })).then(async store => {
      this._maxHeapSize = store.maxHeapSize;

      if (backupStore) {
        if (store.type === 'map') {
          throw new ArgsError("@cachemap/core expected store.type not to be 'map' when backupStore is true.");
        }

        if (isNumber(backupInterval)) {
          this._backupInterval = backupInterval;
        }

        this._backupStore = store;
        this._persistedStore = true;
        this._store = new MapStore({ maxHeapSize: store.maxHeapSize, name: name });
        await this._backupStoreEntriesToStore();
        this._ready = true;
        void this._releaseQueuedRequests();

        if (startBackup) {
          this._startBackup();
        }
      } else {
        this._persistedStore = store.type !== 'map';
        this._store = store;
        await this._retreiveMetadataFromStore();
        this._ready = true;
        void this._releaseQueuedRequests();
      }
    });
  }

  public async clear(): Promise<void> {
    return this._clear();
  }

  public async delete(key: string, options: { hash?: boolean } = {}): Promise<boolean> {
    const errors: ArgsError[] = [];

    if (!isString(key)) {
      errors.push(new ArgsError('@cachemap/core expected key to be a string.'));
    }

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core expected options to be a plain object.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core delete argument validation errors.', errors);
    }

    return this._delete(key, options);
  }

  get emitter(): EventEmitter {
    return this._emitter;
  }

  public async entries<T>(keys?: string[]): Promise<[string, T][]> {
    if (keys && !isArray(keys)) {
      throw new ArgsError('@cachemap/core expected keys to be an array.');
    }

    return this._entries(keys);
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

    return this._export(options);
  }

  public async get<T>(key: string, options: { hash?: boolean } = {}): Promise<T | undefined> {
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

    return this._get<T>(key, options);
  }

  public async has(
    key: string,
    options: { deleteExpired?: boolean; hash?: boolean } = {}
  ): Promise<false | Cacheability> {
    const errors: ArgsError[] = [];

    if (!isString(key)) {
      errors.push(new ArgsError('@cachemap/core expected key to be a string.'));
    }

    if (!isPlainObject(options)) {
      errors.push(new ArgsError('@cachemap/core expected opts to be a plain object.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core has argument validation errors.', errors);
    }

    return this._has(key, options);
  }

  public async import(options: ImportOptions): Promise<void> {
    if (!isPlainObject(options)) {
      throw new ArgsError('@cachemap/core expected options to be a plain object.');
    }

    const { entries, metadata } = options;
    const errors: ArgsError[] = [];

    if (!isArray(entries)) {
      errors.push(new ArgsError('@cachemap/core expected entries to be an array.'));
    }

    if (!isArray(metadata)) {
      errors.push(new ArgsError('@cachemap/core expected metadata to be an array.'));
    }

    if (errors.length > 0) {
      throw new GroupedError('@cachemap/core has argument validation errors.', errors);
    }

    return this._import(options);
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

  public async set(
    key: string,
    value: unknown,
    options: { cacheHeaders?: CacheHeaders; hash?: boolean; tag?: Tag } = {}
  ): Promise<void> {
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

    return this._set(key, value as JsonValue, options);
  }

  public async size(): Promise<number> {
    return this._size();
  }

  public startBackup(): void {
    this._startBackup();
  }

  public stopBackup(): void {
    this._stopBackup();
  }

  get storeType(): string {
    return this._store?.type ?? 'none';
  }

  get type(): string {
    return this._type;
  }

  get usedHeapSize(): number {
    return this._usedHeapSize;
  }

  private _addControllerEventListeners() {
    instance.on(constants.CLEAR, this._handleClearEvent);
    instance.on(constants.START_REAPER, this._handleStartReaperEvent);
    instance.on(constants.STOP_REAPER, this._handleStopReaperEvent);
    instance.on(constants.START_BACKUP, this._handleStartBackupEvent);
    instance.on(constants.STOP_BACKUP, this._handleStopBackupEvent);
  }

  private async _addMetadata(key: string, size: number, cacheability: Cacheability, tag?: Tag): Promise<void> {
    this._metadata.push({
      accessedCount: 0,
      added: Date.now(),
      cacheability,
      key,
      lastAccessed: Date.now(),
      lastUpdated: Date.now(),
      size,
      tags: tag ? [tag] : [],
      updatedCount: 0,
    });

    this._sortMetadata();
    this._updateHeapSize();
    return this._backupMetadata();
  }

  private _addRequestToQueue<T>(methodName: MethodName, ...payload: unknown[]) {
    return new Promise((resolve: (value: T) => void) => {
      this._requestQueue.push([resolve, methodName, payload]);
    });
  }

  private async _backupMetadata(): Promise<void> {
    if (!this._store || !this._persistedStore) {
      return;
    }

    const store = this._backupStore ?? this._store;

    return store.set(
      constants.METADATA,
      prepareSetEntry(dehydrateMetadata(this._metadata) as JsonValue, this._encryptionSecret)
    );
  }

  private async _backupStoreEntriesToStore(): Promise<void> {
    if (!(this._backupStore && this._store)) {
      throw new PositionError(
        '@cachemap/core expected backupStoreEntriesToStore to be called after setting the backupStore and store.'
      );
    }

    this._metadata = [];
    const backupMetadata = await this._backupStore.get(constants.METADATA);

    if (backupMetadata) {
      const metadata = prepareGetEntry<DehydratedMetadata[]>(backupMetadata, this._encryptionSecret);

      if (metadata.length > 0) {
        const keys = metadata.map(entry => entry.key);
        await this._store.import(await this._backupStore.entries(keys));
        this._metadata = rehydrateMetadata(metadata);
      }
    }
  }

  private _calcReductionChunk(): number | undefined {
    const reductionSize = Math.round(this._maxHeapSize * 0.2);
    let chunkSize = 0;
    let chunk: number | undefined;

    for (let index = this._metadata.length - 1; index >= 0; index -= 1) {
      chunkSize += this._metadata[index]!.size;

      if (chunkSize > reductionSize) {
        chunk = index;
        break;
      }
    }

    return chunk;
  }

  private async _clear(): Promise<void> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue(constants.CLEAR);
    }

    await this._store.clear();
    this._metadata = [];
    this._processing = [];
    this._updateHeapSize();
    return this._backupMetadata();
  }

  private async _delete(key: string, options: { hash?: boolean } = {}): Promise<boolean> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue(constants.DELETE, key, options);
    }

    const deleteKey = options.hash ? Md5.hashStr(key) : key;
    const deleted = await this._store.delete(deleteKey);

    if (!deleted) {
      return false;
    }

    await this._deleteMetadata(deleteKey);
    return true;
  }

  private async _deleteMetadata(key: string): Promise<void> {
    const index = this._metadata.findIndex(metadata => metadata.key === key);

    if (index === -1) {
      return;
    }

    this._metadata.splice(index, 1);
    this._sortMetadata();
    this._updateHeapSize();
    return this._backupMetadata();
  }

  private async _entries<T>(keys?: string[]): Promise<[string, T][]> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue(constants.ENTRIES, keys);
    }

    const entryKeys = keys ?? this._metadata.map(metadata => metadata.key);
    const entries = await this._store.entries(entryKeys);
    return entries.map(([key, data]) => [key, prepareGetEntry(data, this._encryptionSecret)]);
  }

  private async _export<T>({
    filterByValue,
    keys,
    tag,
  }: {
    filterByValue?: FilterByValue | FilterByValue[];
    keys?: string[];
    tag?: Tag;
  }): Promise<ExportResult<T>> {
    let exportKeys: string[] | undefined;
    let metadata = this._metadata;

    if (tag) {
      metadata = this._metadata.filter(meta => meta.tags.includes(tag));
      exportKeys = metadata.map(meta => meta.key);
    } else if (keys) {
      metadata = this._metadata.filter(meta => keys.includes(meta.key));
      exportKeys = keys;
    }

    let entries = await this._entries<T>(exportKeys);

    if (filterByValue) {
      const castFilterByValue = castArray(filterByValue);

      entries = entries.filter(([, data]) =>
        castFilterByValue.every(({ comparator, keyChain }) => get(data, keyChain) === comparator)
      );

      metadata = metadata.filter(meta => entries.some(([key]) => key === meta.key));
    }

    return { entries, metadata };
  }

  private async _get<T>(key: string, options: { hash?: boolean }): Promise<T | undefined> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue(constants.GET, key, options);
    }

    const getKey = options.hash ? Md5.hashStr(key) : key;
    const value = await this._store.get(getKey);

    if (!value) {
      return;
    }

    await this._updateMetadata(getKey);
    return prepareGetEntry(value, this._encryptionSecret);
  }

  private _getCacheability(key: string): Cacheability | undefined {
    const metadata = this._getMetadataEntry(key);
    return metadata ? metadata.cacheability : undefined;
  }

  private _getMetadataEntry(key: string): Metadata | undefined {
    return this._metadata.find(metadata => metadata.key === key);
  }

  private async _has(key: string, options: { deleteExpired?: boolean; hash?: boolean }): Promise<false | Cacheability> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue(constants.HAS, key, options);
    }

    const hasKey = options.hash ? Md5.hashStr(key) : key;
    const exists = await this._store.has(hasKey);

    if (!exists) {
      return false;
    }

    if (options.deleteExpired && this._hasCacheEntryExpired(hasKey)) {
      await this.delete(hasKey);
      return false;
    }

    return this._getCacheability(hasKey) ?? false;
  }

  private _hasCacheEntryExpired(key: string): boolean {
    if (this._disableCacheInvalidation) {
      return false;
    }

    const cacheability = this._getCacheability(key);
    return cacheability ? !cacheability.checkTTL() : false;
  }

  private async _import(options: ImportOptions): Promise<void> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue(constants.IMPORT, options);
    }

    let filterd: Metadata[] = [];

    if (this._metadata.length > 0) {
      filterd = this._metadata.filter(metadata => {
        return !options.metadata.some(optionsMetadata => metadata.key === optionsMetadata.key);
      });
    }

    const entries = options.entries.map(
      ([key, data]) => [key, prepareSetEntry(data, this._encryptionSecret)] as [string, string]
    );

    await this._store.import(entries);
    this._metadata = rehydrateMetadata([...filterd, ...options.metadata]);
    this._sortMetadata();
    await this._backupMetadata();
    this._updateHeapSize();
  }

  private _initializeReaper(reaperInit: ReaperInit): Reaper {
    return reaperInit({
      deleteCallback: async (key: string, tags?: Tag[]) => {
        this.emitter.emit(this.events.ENTRY_DELETED, { deleted: await this._delete(key), key, tags });
      },
      metadataCallback: () => this._metadata,
    });
  }

  private _processed(key: string): void {
    this._processing = this._processing.filter(value => value !== key);
  }

  private _reduceHeapSize(): void {
    const index = this._calcReductionChunk();

    if (!index || !this._reaper) {
      return;
    }

    void this._reaper.cull(this._metadata.slice(index, this._metadata.length));
  }

  private async _releaseQueuedRequests() {
    for (const [resolve, methodName, payload] of this._requestQueue) {
      // @ts-expect-error complicated
      resolve(await this[methodName](...payload));
    }

    this._requestQueue = [];
  }

  private async _retreiveMetadataFromStore(): Promise<void> {
    if (!this._store || !this._persistedStore) {
      return;
    }

    const metadata = await this._store.get(constants.METADATA);

    if (metadata) {
      this._metadata = rehydrateMetadata(prepareGetEntry(metadata));
    }
  }

  private async _set(
    key: string,
    value: JsonValue,
    options: { cacheHeaders?: CacheHeaders; hash?: boolean; tag?: Tag }
  ): Promise<void> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue(constants.SET, key, value, options);
    }

    const cacheability = new Cacheability({ headers: options.cacheHeaders });
    const { cacheControl } = cacheability.metadata;

    if (cacheControl.noStore || (this._sharedCache && cacheControl.private)) {
      return;
    }

    const setKey = options.hash ? Md5.hashStr(key) : key;
    const processing = this._processing.includes(setKey);

    if (!processing) {
      this._processing.push(setKey);
    }

    try {
      const exists = (await this._store.has(setKey)) || processing;
      const preparedSetValue = prepareSetEntry(value, this._encryptionSecret);
      await this._store.set(setKey, preparedSetValue);

      await (exists
        ? this._updateMetadata(setKey, sizeOf(preparedSetValue), cacheability, options.tag)
        : this._addMetadata(setKey, sizeOf(preparedSetValue), cacheability, options.tag));

      this._processed(setKey);
    } catch (error) {
      this._processed(setKey);
      throw error;
    }
  }

  private async _size(): Promise<number> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue(constants.SIZE);
    }

    return this._store.size();
  }

  private _sortMetadata(): void {
    this._metadata.sort(Core._sortComparator);
  }

  private _startBackup(): void {
    this._backupIntervalID = setInterval(() => {
      void this._storeEntriesToBackupStore();
    }, this._backupInterval);
  }

  private _stopBackup(): void {
    if (this._backupIntervalID) {
      clearInterval(this._backupIntervalID);
    }
  }

  private async _storeEntriesToBackupStore(): Promise<void> {
    if (!(this._backupStore && this._store)) {
      return;
    }

    await this._backupStore.clear();
    const keys = this._metadata.map(entry => entry.key);
    void this._backupStore.import(await this._store.entries(keys));
  }

  private _updateHeapSize(): void {
    this._usedHeapSize = this._metadata.reduce((acc, value) => acc + value.size, 0);

    if (!this._disableCacheInvalidation && this._usedHeapSize > this._maxHeapSize) {
      this._reduceHeapSize();
    }
  }

  private async _updateMetadata(key: string, size?: number, cacheability?: Cacheability, tag?: Tag): Promise<void> {
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

    this._sortMetadata();
    this._updateHeapSize();
    return this._backupMetadata();
  }
}
