import {
  CLEAR,
  DELETE,
  ENTRIES,
  GET,
  HAS,
  IMPORT,
  METADATA,
  SET,
  SIZE,
  START_BACKUP,
  START_REAPER,
  STOP_BACKUP,
  STOP_REAPER,
} from "@cachemap/constants";
import controller from "@cachemap/controller";
import { MapStore } from "@cachemap/map";
import { Metadata, Store } from "@cachemap/types";
import Cacheability from "cacheability";
import EventEmitter from "eventemitter3";
import { castArray, get, isArray, isFunction, isNumber, isPlainObject, isString, isUndefined } from "lodash";
import md5 from "md5";
import sizeof from "object-sizeof";
import { DEFAULT_BACKUP_INTERVAL, DEFAULT_MAX_HEAP_SIZE } from "../constants";
import { decode, encode } from "../helpers/base64";
import { decrypt, encrypt } from "../helpers/encryption";
import { rehydrateMetadata } from "../helpers/rehydrate-metadata";
import {
  CacheHeaders,
  ConstructorOptions,
  ControllerEvent,
  DehydratedMetadata,
  ExportOptions,
  ExportResult,
  FilterByValue,
  ImportOptions,
  MethodName,
  Reaper,
  ReaperInit,
  RequestQueue,
} from "../types";

export default class Core {
  private static _sortComparator(a: Metadata, b: Metadata): number {
    let i;

    if (a.accessedCount > b.accessedCount) {
      i = -1;
    } else if (a.accessedCount < b.accessedCount) {
      i = 1;
    } else if (a.lastAccessed > b.lastAccessed) {
      i = -1;
    } else if (a.lastAccessed < b.lastAccessed) {
      i = 1;
    } else if (a.lastUpdated > b.lastUpdated) {
      i = -1;
    } else if (a.lastUpdated < b.lastUpdated) {
      i = 1;
    } else if (a.added > b.added) {
      i = -1;
    } else if (a.added < b.added) {
      i = 1;
    } else if (a.size < b.size) {
      i = -1;
    } else if (a.size > b.size) {
      i = 1;
    } else {
      i = 0;
    }

    return i;
  }

  public events = {
    ENTRY_DELETED: "ENTRY_DELETED",
  };

  private _backupInterval: number = DEFAULT_BACKUP_INTERVAL;
  private _backupIntervalID?: NodeJS.Timer;
  private _backupStore: Store | null = null;
  private _disableCacheInvalidation: boolean;
  private _emitter: EventEmitter = new EventEmitter();
  private _encryptionSecret: string | undefined;
  private _maxHeapSize: number = DEFAULT_MAX_HEAP_SIZE;
  private _metadata: Metadata[] = [];
  private _name: string;
  private _persistedStore: boolean = true;
  private _processing: string[] = [];
  private _ready: boolean = false;
  private _reaper?: Reaper;
  private _requestQueue: RequestQueue = [];
  private _sharedCache: boolean;
  private _store: Store | null = null;
  private _type: string;
  private _usedHeapSize: number = 0;

  constructor(options: ConstructorOptions) {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@cachemap/core expected options to be a plain object."));
    }

    if (!isString(options.name)) {
      errors.push(new TypeError("@cachemap/core expected options.name to be a string."));
    }

    if (!isFunction(options.store)) {
      errors.push(new TypeError("@cachemap/core expected options.store to be a function."));
    }

    if (!isString(options.type)) {
      errors.push(new TypeError("@cachemap/core expected options.type to be a string."));
    }

    if (errors.length) {
      throw errors;
    }

    this._disableCacheInvalidation = options.disableCacheInvalidation ?? false;

    if (isString(options.encryptionSecret)) {
      this._encryptionSecret = options.encryptionSecret;
    }

    this._name = options.name;

    if (isFunction(options.reaper)) {
      this._reaper = this._initializeReaper(options.reaper);
    }

    this._sharedCache = options.sharedCache ?? false;

    if (isFunction(options.sortComparator)) {
      Core._sortComparator = options.sortComparator;
    }

    this._type = options.type;
    this._addControllerEventListeners();

    options.store({ name: options.name }).then(store => {
      this._maxHeapSize = store.maxHeapSize;

      if (options.backupStore) {
        if (store.type === "map") {
          throw new TypeError("@cachemap/core expected store.type not to be 'map' when options.backupStore is true.");
        }

        if (isNumber(options.backupInterval)) {
          this._backupInterval = options.backupInterval;
        }

        this._backupStore = store;
        this._persistedStore = true;
        this._store = new MapStore({ maxHeapSize: store.maxHeapSize, name: options.name });

        this._backupStoreEntriesToStore().then(() => {
          this._ready = true;
          this._releaseQueuedRequests();

          if (options.startBackup) {
            this._startBackup();
          }
        });
      } else {
        this._persistedStore = store.type !== "map";
        this._store = store;
        this._ready = true;
        this._retreiveMetadata();
        this._releaseQueuedRequests();
      }
    });
  }

  get emitter(): EventEmitter {
    return this._emitter;
  }

  get metadata(): Metadata[] {
    return this._metadata;
  }

  get name(): string {
    return this._name;
  }

  get reaper(): Reaper | void {
    return this._reaper;
  }

  get storeType(): string {
    return this._store?.type ?? "none";
  }

  get type(): string {
    return this._type;
  }

  get usedHeapSize(): number {
    return this._usedHeapSize;
  }

  public async clear(): Promise<void> {
    try {
      return this._clear();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async delete(key: string, options: { hash?: boolean } = {}): Promise<boolean> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("@cachemap/core expected key to be a string."));
    }

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@cachemap/core expected options to be a plain object."));
    }

    if (errors.length) {
      return Promise.reject(errors);
    }

    try {
      return this._delete(key, options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async entries(keys?: string[]): Promise<[string, any][]> {
    if (keys && !isArray(keys)) {
      return Promise.reject(new TypeError("@cachemap/core expected keys to be an array."));
    }

    try {
      return this._entries(keys);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async export(options: ExportOptions = {}): Promise<ExportResult> {
    const errors: TypeError[] = [];

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@cachemap/core expected options to be an plain object."));
    }

    if (options.keys && !isArray(options.keys)) {
      errors.push(new TypeError("@cachemap/core expected options.keys to be an array."));
    }

    if (errors.length) {
      return Promise.reject(errors);
    }

    try {
      return this._export(options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get(key: string, options: { hash?: boolean } = {}): Promise<any> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("@cachemap/core expected key to be a string."));
    }

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@cachemap/core expected options to be a plain object."));
    }

    if (errors.length) {
      return Promise.reject(errors);
    }

    try {
      return this._get(key, options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async has(
    key: string,
    options: { deleteExpired?: boolean; hash?: boolean } = {},
  ): Promise<false | Cacheability> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("@cachemap/core expected key to be a string."));
    }

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@cachemap/core expected opts to be a plain object."));
    }

    if (errors.length) {
      return Promise.reject(errors);
    }

    try {
      return this._has(key, options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async import(options: ImportOptions): Promise<void> {
    if (!isPlainObject(options)) {
      return Promise.reject("@cachemap/core expected options to be a plain object.");
    }

    const { entries, metadata } = options;
    const errors: TypeError[] = [];

    if (!isArray(entries)) {
      errors.push(new TypeError("@cachemap/core expected entries to be an array."));
    }

    if (!isArray(metadata)) {
      errors.push(new TypeError("@cachemap/core expected metadata to be an array."));
    }

    if (errors.length) {
      return Promise.reject(errors);
    }

    try {
      await this._import(options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async set(
    key: string,
    value: any,
    options: { cacheHeaders?: CacheHeaders; hash?: boolean; tag?: any } = {},
  ): Promise<void> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("@cachemap/core expected key to be a string."));
    }

    if (!isPlainObject(options)) {
      errors.push(new TypeError("@cachemap/core expected opts to be a plain object."));
    }

    if (errors.length) {
      return Promise.reject(errors);
    }

    try {
      return this._set(key, value, options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async size(): Promise<number> {
    try {
      return this._size();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public startBackup(): void {
    this._startBackup();
  }

  public stopBackup(): void {
    this._stopBackup();
  }

  private _addControllerEventListeners() {
    this._handleClearEvent = this._handleClearEvent.bind(this);
    this._handleStartReaperEvent = this._handleStartReaperEvent.bind(this);
    this._handleStopReaperEvent = this._handleStopReaperEvent.bind(this);
    this._handleStartBackupEvent = this._handleStartBackupEvent.bind(this);
    this._handleStopBackupEvent = this._handleStopBackupEvent.bind(this);
    controller.on(CLEAR, this._handleClearEvent);
    controller.on(START_REAPER, this._handleStartReaperEvent);
    controller.on(STOP_REAPER, this._handleStopReaperEvent);
    controller.on(START_BACKUP, this._handleStartBackupEvent);
    controller.on(STOP_BACKUP, this._handleStopBackupEvent);
  }

  private async _addMetadata(key: string, size: number, cacheability: Cacheability, tag?: any): Promise<void> {
    this._metadata.push({
      accessedCount: 0,
      added: Date.now(),
      cacheability,
      key,
      lastAccessed: Date.now(),
      lastUpdated: Date.now(),
      size,
      tags: !isUndefined(tag) ? [tag] : [],
      updatedCount: 0,
    });

    this._sortMetadata();
    this._updateHeapSize();

    try {
      await this._backupMetadata();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _addRequestToQueue<T>(methodName: MethodName, ...payload: any[]) {
    return new Promise((resolve: (value: T) => void) => {
      this._requestQueue.push([resolve, methodName, payload]);
    });
  }

  private async _backupMetadata(): Promise<void> {
    if (!this._store || !this._persistedStore) {
      return;
    }

    try {
      await this._store.set(METADATA, this._metadata);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _backupStoreEntriesToStore(): Promise<void> {
    if (!(this._backupStore && this._store)) {
      return;
    }

    const metadata: DehydratedMetadata[] = (await this._backupStore.get(METADATA)) ?? [];

    if (metadata.length) {
      const keys = metadata.map(entry => entry.key);
      await this._store.import(await this._backupStore.entries(undefined, { allKeys: keys }));
    }

    this._metadata = rehydrateMetadata(metadata);
  }

  private _calcReductionChunk(): number | undefined {
    const reductionSize = Math.round(this._maxHeapSize * 0.2);
    let chunkSize = 0;
    let index: number | undefined;

    for (let i = this._metadata.length - 1; i >= 0; i -= 1) {
      chunkSize += this._metadata[i].size;

      if (chunkSize > reductionSize) {
        index = i;
        break;
      }
    }

    return index;
  }

  private async _clear() {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue<void>(CLEAR);
    }

    try {
      await this._store.clear();
      this._metadata = [];
      this._processing = [];
      this._updateHeapSize();
      await this._backupMetadata();
    } catch (error) {
      Promise.reject(error);
    }
  }

  private async _delete(key: string, options: { hash?: boolean } = {}): Promise<boolean> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue<boolean>(DELETE, key, options);
    }

    const _key = options.hash ? md5(key) : key;

    try {
      const deleted = await this._store.delete(_key);

      if (!deleted) {
        return false;
      }

      await this._deleteMetadata(_key);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _deleteMetadata(key: string): Promise<void> {
    const index = this._metadata.findIndex(metadata => metadata.key === key);

    if (index === -1) {
      return;
    }

    this._metadata.splice(index, 1);
    this._sortMetadata();
    this._updateHeapSize();

    try {
      await this._backupMetadata();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _entries(keys?: string[]): Promise<[string, any][]> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue<[string, any][]>(ENTRIES, keys);
    }

    try {
      const _keys = keys || this._metadata.map(metadata => metadata.key);

      const entries = (await this._store.entries(_keys)).map(([key, data]) => [
        key,
        this._encryptionSecret ? decrypt(data, this._encryptionSecret) : decode(data),
      ]) as [string, any][];

      return entries;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _export(options: {
    filterByValue?: FilterByValue | FilterByValue[];
    keys?: string[];
    tag?: any;
  }): Promise<ExportResult> {
    let keys: string[] | undefined;
    let metadata = this._metadata;

    if (options.tag) {
      metadata = this._metadata.filter(meta => meta.tags.includes(options.tag));
      keys = metadata.map(meta => meta.key);
    } else if (options.keys) {
      metadata = this._metadata.filter(meta => (options.keys as string[]).includes(meta.key));
      keys = options.keys;
    }

    try {
      let entries = await this._entries(keys);

      if (options.filterByValue) {
        const castFilterByValue = castArray(options.filterByValue);

        entries = entries.filter(([, data]) =>
          castFilterByValue.every(({ keyChain, comparator }) => get(data, keyChain) === comparator),
        );

        metadata = metadata.filter(meta => entries.some(([key]) => key === meta.key));
      }

      return { entries, metadata };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _get(key: string, options: { hash?: boolean }): Promise<any> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue<any>(GET, key, options);
    }

    const _key = options.hash ? md5(key) : key;

    try {
      const value = await this._store.get(_key);

      if (!value) {
        return undefined;
      }

      await this._updateMetadata(_key);
      return this._encryptionSecret ? decrypt(value, this._encryptionSecret) : decode(value);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _getCacheability(key: string): Cacheability | undefined {
    const metadata = this._getMetadataEntry(key);
    return metadata ? metadata.cacheability : undefined;
  }

  private _getMetadataEntry(key: string): Metadata | undefined {
    return this._metadata.find(metadata => metadata.key === key);
  }

  private _handleClearEvent({ name, type }: ControllerEvent): void {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._clear();
    }
  }

  private _handleStartBackupEvent({ name, type }: ControllerEvent): void {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._startBackup();
    }
  }

  private _handleStartReaperEvent({ name, type }: ControllerEvent): void {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._reaper?.start();
    }
  }

  private _handleStopBackupEvent({ name, type }: ControllerEvent): void {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._stopBackup();
    }
  }

  private _handleStopReaperEvent({ name, type }: ControllerEvent): void {
    if ((isString(name) && name === this._name) || (isString(type) && type === this._type)) {
      this._reaper?.stop();
    }
  }

  private async _has(key: string, options: { deleteExpired?: boolean; hash?: boolean }): Promise<false | Cacheability> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue<any>(HAS, key, options);
    }

    const _key = options.hash ? md5(key) : key;

    try {
      const exists = await this._store.has(_key);

      if (!exists) {
        return false;
      }

      if (options.deleteExpired && this._hasCacheEntryExpired(_key)) {
        await this.delete(_key);
        return false;
      }

      return this._getCacheability(_key) || false;
    } catch (error) {
      return Promise.reject(error);
    }
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
      return this._addRequestToQueue<void>(IMPORT, options);
    }

    let filterd: Metadata[] = [];

    if (this._metadata.length) {
      filterd = this._metadata.filter(metadata => {
        return !options.metadata.find(optionsMetadata => metadata.key === optionsMetadata.key);
      });
    }

    try {
      const entries = options.entries.map(([key, data]) => [
        key,
        this._encryptionSecret ? encrypt(data, this._encryptionSecret) : encode(data),
      ]) as [string, any][];

      await this._store.import(entries);
      this._metadata = rehydrateMetadata([...filterd, ...options.metadata]);
    } catch (error) {
      return Promise.reject(error);
    }

    this._sortMetadata();

    try {
      await this._backupMetadata();
    } catch (error) {
      return Promise.reject(error);
    }

    this._updateHeapSize();
  }

  private _initializeReaper(reaperInit: ReaperInit): Reaper {
    return reaperInit({
      deleteCallback: async (key: string, tags?: any[]) => {
        this.emitter.emit(this.events.ENTRY_DELETED, { key, deleted: await this._delete(key), tags });
      },
      metadataCallback: () => this._metadata,
    });
  }

  private _processed(key: string): void {
    this._processing = this._processing.filter(value => value !== key);
  }

  private async _reduceHeapSize(): Promise<void> {
    const index = this._calcReductionChunk();

    if (!index || !this._reaper) {
      return;
    }

    this._reaper.cull(this._metadata.slice(index, this._metadata.length));
  }

  private _releaseQueuedRequests() {
    this._requestQueue.forEach(async ([resolve, methodName, payload]) => {
      // @ts-ignore
      resolve(await this[methodName](...payload));
    });

    this._requestQueue = [];
  }

  private async _retreiveMetadata(): Promise<void> {
    if (!this._store || !this._persistedStore) {
      return;
    }

    try {
      const metadata: Metadata[] = await this._store.get(METADATA);

      if (isArray(metadata)) {
        this._metadata = rehydrateMetadata(metadata);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _set(
    key: string,
    value: any,
    options: { cacheHeaders?: CacheHeaders; hash?: boolean; tag?: any },
  ): Promise<void> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue<void>(SET, key, value, options);
    }

    const cacheability = new Cacheability({ headers: options.cacheHeaders });
    const cacheControl = cacheability.metadata.cacheControl;

    if (cacheControl.noStore || (this._sharedCache && cacheControl.private)) {
      return;
    }

    const _key = options.hash ? md5(key) : key;
    const processing = this._processing.includes(_key);

    if (!processing) {
      this._processing.push(_key);
    }

    try {
      const exists = (await this._store.has(_key)) || processing;
      value = this._encryptionSecret ? encrypt(value, this._encryptionSecret) : encode(value);
      await this._store.set(_key, value);

      if (exists) {
        await this._updateMetadata(_key, sizeof(value), cacheability, options.tag);
      } else {
        await this._addMetadata(_key, sizeof(value), cacheability, options.tag);
      }

      this._processed(_key);
    } catch (error) {
      this._processed(_key);
      return Promise.reject(error);
    }
  }

  private async _size(): Promise<number> {
    if (!this._ready || !this._store) {
      return this._addRequestToQueue<number>(SIZE);
    }

    try {
      return this._store.size();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _sortMetadata(): void {
    this._metadata.sort(Core._sortComparator);
  }

  private _startBackup(): void {
    this._backupIntervalID = setInterval(() => {
      this._storeEntriesToBackupStore();
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
    this._backupStore.import(await this._store.entries());
  }

  private _updateHeapSize(): void {
    this._usedHeapSize = this._metadata.reduce((acc, value) => acc + value.size, 0);

    if (!this._disableCacheInvalidation && this._usedHeapSize > this._maxHeapSize) {
      this._reduceHeapSize();
    }
  }

  private async _updateMetadata(key: string, size?: number, cacheability?: Cacheability, tag?: any): Promise<void> {
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

    try {
      await this._backupMetadata();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
