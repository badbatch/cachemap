import { CLEAR, DELETE, ENTRIES, GET, HAS, IMPORT, METADATA, SET, SIZE } from "@cachemap/constants";
import Cacheability from "cacheability";
import { isArray, isFunction, isPlainObject, isString, isUndefined } from "lodash";
import md5 from "md5";
import sizeof from "object-sizeof";
import { DEFAULT_MAX_HEAP_SIZE } from "../constants";
import { rehydrateMetadata } from "../helpers/rehydrate-metadata";
import {
  CacheHeaders,
  ConstructorOptions,
  ExportOptions,
  ExportResult,
  ImportOptions,
  Metadata,
  MethodName,
  Reaper,
  ReaperInit,
  RequestQueue,
  Store,
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

  private _disableCacheInvalidation: boolean;
  private _maxHeapSize: number = DEFAULT_MAX_HEAP_SIZE;
  private _metadata: Metadata[] = [];
  private _name: string;
  private _persistedStore: boolean = true;
  private _processing: string[] = [];
  private _reaper?: Reaper;
  private _requestQueue: RequestQueue = [];
  private _sharedCache: boolean;
  private _store: Store | null = null;
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

    if (errors.length) throw errors;

    this._disableCacheInvalidation = options.disableCacheInvalidation || false;
    this._name = options.name;

    if (isFunction(options.reaper)) {
      this._reaper = this._initializeReaper(options.reaper);
    }

    this._sharedCache = options.sharedCache || false;

    if (isFunction(options.sortComparator)) {
      Core._sortComparator = options.sortComparator;
    }

    options.store({ name: options.name }).then(store => {
      this._maxHeapSize = store.maxHeapSize;
      this._store = store;
      this._persistedStore = store.type !== "map";
      this._retreiveMetadata();
      this._releaseQueuedRequests();
    });
  }

  get metadata(): Metadata[] {
    return this._metadata;
  }

  get name(): string {
    return this._name;
  }

  get storeType(): string {
    return this._store?.type ?? "none";
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

    if (errors.length) return Promise.reject(errors);

    try {
      return this._delete(key, options);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async entries(keys?: string[]): Promise<Array<[string, any]>> {
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

    if (errors.length) return Promise.reject(errors);

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

    if (errors.length) return Promise.reject(errors);

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

    if (errors.length) return Promise.reject(errors);

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

    if (errors.length) return Promise.reject(errors);

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

    if (errors.length) return Promise.reject(errors);

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
    if (!this._store || !this._persistedStore) return;

    try {
      await this._store.set(METADATA, this._metadata);
    } catch (error) {
      return Promise.reject(error);
    }
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
    if (!this._store) {
      return this._addRequestToQueue<void>(CLEAR);
    }

    try {
      await this._store.clear();
      this._metadata = [];
      this._processing = [];
      await this._backupMetadata();
    } catch (error) {
      Promise.reject(error);
    }
  }

  private async _delete(key: string, options: { hash?: boolean } = {}): Promise<boolean> {
    if (!this._store) {
      return this._addRequestToQueue<boolean>(DELETE, key, options);
    }

    const _key = options.hash ? md5(key) : key;

    try {
      const deleted = await this._store.delete(_key);
      if (!deleted) return false;

      await this._deleteMetadata(_key);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _deleteMetadata(key: string): Promise<void> {
    const index = this._metadata.findIndex(metadata => metadata.key === key);
    if (index === -1) return;

    this._metadata.splice(index, 1);
    this._sortMetadata();
    this._updateHeapSize();

    try {
      await this._backupMetadata();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _entries(keys?: string[]): Promise<Array<[string, any]>> {
    if (!this._store) {
      return this._addRequestToQueue<Array<[string, any]>>(ENTRIES, keys);
    }

    try {
      const _keys = keys || this._metadata.map(metadata => metadata.key);
      return this._store.entries(_keys);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _export(options: { keys?: string[]; tag?: any }): Promise<ExportResult> {
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
      return { entries: await this._entries(keys), metadata };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _get(key: string, options: { hash?: boolean }): Promise<any> {
    if (!this._store) {
      return this._addRequestToQueue<any>(GET, key, options);
    }

    const _key = options.hash ? md5(key) : key;

    try {
      const value = await this._store.get(_key);
      if (!value) return undefined;

      await this._updateMetadata(_key);
      return value;
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

  private async _has(key: string, options: { deleteExpired?: boolean; hash?: boolean }): Promise<false | Cacheability> {
    if (!this._store) {
      return this._addRequestToQueue<any>(HAS, key, options);
    }

    const _key = options.hash ? md5(key) : key;

    try {
      const exists = await this._store.has(_key);
      if (!exists) return false;

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
    if (this._disableCacheInvalidation) return false;

    const cacheability = this._getCacheability(key);
    return cacheability ? !cacheability.checkTTL() : false;
  }

  private async _import(options: ImportOptions): Promise<void> {
    if (!this._store) {
      return this._addRequestToQueue<void>(IMPORT, options);
    }

    let filterd: Metadata[] = [];

    if (this._metadata.length) {
      filterd = this._metadata.filter(metadata => {
        return !options.metadata.find(optionsMetadata => metadata.key === optionsMetadata.key);
      });
    }

    try {
      await this._store.import(options.entries);
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
      deleteCallback: (key: string, options: { hash?: boolean } = {}): Promise<boolean> => this._delete(key, options),
      metadataCallback: () => this._metadata,
    });
  }

  private _processed(key: string): void {
    this._processing = this._processing.filter(value => value !== key);
  }

  private async _reduceHeapSize(): Promise<void> {
    const index = this._calcReductionChunk();
    if (!index || !this._reaper) return;

    this._reaper.cull(this._metadata.slice(index, this._metadata.length));
  }

  private _releaseQueuedRequests() {
    this._requestQueue.forEach(async ([resolve, methodName, payload]) => {
      // @ts-ignore
      resolve(await this[methodName](...payload));
    });
  }

  private async _retreiveMetadata(): Promise<void> {
    if (!this._store || !this._persistedStore) return;

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
    if (!this._store) {
      return this._addRequestToQueue<void>(SET, key, value, options);
    }

    const cacheability = new Cacheability({ headers: options.cacheHeaders });
    const cacheControl = cacheability.metadata.cacheControl;
    if (cacheControl.noStore || (this._sharedCache && cacheControl.private)) return;

    const _key = options.hash ? md5(key) : key;
    const processing = this._processing.includes(_key);
    if (!processing) this._processing.push(_key);

    try {
      const exists = (await this._store.has(_key)) || processing;
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
    if (!this._store) {
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

  private _updateHeapSize(): void {
    this._usedHeapSize = this._metadata.reduce((acc, value) => acc + value.size, 0);

    if (!this._disableCacheInvalidation && this._usedHeapSize > this._maxHeapSize) {
      this._reduceHeapSize();
    }
  }

  private async _updateMetadata(key: string, size?: number, cacheability?: Cacheability, tag?: any): Promise<void> {
    const entry = this._getMetadataEntry(key);
    if (!entry) return;

    if (size) {
      entry.size = size;
      entry.lastUpdated = Date.now();
      entry.updatedCount += 1;
    } else {
      entry.accessedCount += 1;
      entry.lastAccessed = Date.now();
    }

    if (cacheability) entry.cacheability = cacheability;
    if (!isUndefined(tag)) entry.tags.push(tag);

    this._sortMetadata();
    this._updateHeapSize();

    try {
      await this._backupMetadata();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
