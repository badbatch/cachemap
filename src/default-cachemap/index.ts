import Cacheability from "cacheability";
import { isArray, isBoolean, isFunction, isPlainObject, isString, isUndefined } from "lodash";
import * as md5 from "md5";
import * as sizeof from "object-sizeof";
import { ClientOpts } from "redis";
import { IndexedDBProxy } from "~/default-cachemap/proxies/indexed-db";
import { LocalStorageProxy } from "~/default-cachemap/proxies/local-storage";
import { MapProxy } from "~/default-cachemap/proxies/map";
import { RedisProxy } from "~/default-cachemap/proxies/redis";
import { Reaper } from "~/default-cachemap/reaper";
import { convertCacheability } from "~/helpers/convert-cacheability";
import { supportsWorkerIndexedDB } from "~/helpers/user-agent-parser";
import {
  CacheHeaders,
  ConstructorArgs,
  ExportResult,
  ImportArgs,
  IndexedDBOptions,
  Metadata,
  StoreProxyTypes,
  StoreTypes,
} from "~/types";

let redisProxy: typeof RedisProxy;

if (!process.env.WEB_ENV) {
  redisProxy = require("~/default-cachemap/proxies/redis").RedisProxy;
}

/**
 * An isomorphic cache that works on the server and the
 * browser, that can use Redis, LocalStorage, IndexedDB
 * or an in-memory Map.
 *
 * ```typescript
 * import { DefaultCachemap } from "cachemap";
 *
 * const cachemap = await DefaultCachemap.create({
 *   name: "alfa",
 *   use: { client: "localStorage", server: "redis" },
 * });
 * ```
 *
 */
export class DefaultCachemap {
  /**
   * The method creates an instance of either the server or
   * browser version of DefaultCachemap based on whether
   * the `WEB_ENV` environment variable is set to `true`.
   *
   * NOTE: Set the `WEB_ENV` environment variable when compiling
   * browser bundle.
   *
   * ```typescript
   * const cachemap = await DefaultCachemap.create({
   *   name: "alfa",
   *   use: { client: "localStorage", server: "redis" },
   * });
   * ```
   *
   */
  public static async create(args: ConstructorArgs): Promise<DefaultCachemap> {
    try {
      const cachemap = new DefaultCachemap(args);
      await cachemap._createStore();
      await cachemap._retreiveMetadata();
      return cachemap;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private static _storeTypes: string[] = ["indexedDB", "localStorage", "map", "redis"];

  private static _calcMaxHeapSize(storeType: StoreTypes, maxHeapSize?: number): number {
    const megabyte = 1048576;
    let max: number;

    if (storeType === "indexedDB") {
      max = maxHeapSize || (megabyte * 5);
    } else if (storeType === "localStorage") {
      max = maxHeapSize || (megabyte * 5);
    } else if (storeType === "redis") {
      max = maxHeapSize || Infinity;
    } else {
      max = maxHeapSize || megabyte;
    }

    return max;
  }

  private static _calcMaxHeapThreshold(maxHeapSize: number): number {
    return maxHeapSize !== Infinity ? (maxHeapSize * 0.8) : Infinity;
  }

  private static _getStoreType(storeType?: StoreTypes): StoreTypes {
    return storeType || "map";
  }

  private static _hash(value: string): string {
    return md5(value);
  }

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
  private _indexedDBOptions?: IndexedDBOptions;
  private _inWorker: boolean;
  private _maxHeapSize: number;
  private _maxHeapThreshold: number;
  private _metadata: Metadata[] = [];
  private _mockRedis: boolean;
  private _name: string;
  private _processing: string[] = [];
  private _reaper: Reaper;
  private _redisOptions?: ClientOpts;
  private _sharedCache: boolean = false;
  private _store: StoreProxyTypes;
  private _storeType: StoreTypes;
  private _usedHeapSize: number = 0;

  constructor(args: ConstructorArgs) {
    if (!isPlainObject(args)) {
      throw new TypeError("Constructor expected args to ba a plain object.");
    }

    const {
      _inWorker = false,
      disableCacheInvalidation = false,
      indexedDBOptions,
      maxHeapSize = {},
      mockRedis,
      name,
      reaperOptions,
      redisOptions,
      sharedCache,
      sortComparator,
      use = {},
    } = args;

    const errors: TypeError[] = [];

    if (!isString(name)) {
      errors.push(new TypeError("Constructor expected name to be a string."));
    }

    if (!isPlainObject(maxHeapSize)) {
      errors.push(new TypeError("Constructor expected maxHeapSize to be a plain object."));
    }

    if (!isPlainObject(use)) {
      errors.push(new TypeError("Constructor expected use to be a plain object."));
    }

    if (errors.length) throw errors;
    const storeType = DefaultCachemap._getStoreType(process.env.WEB_ENV ? use.client : use.server);

    if (!DefaultCachemap._storeTypes.find((type) => type === storeType)) {
      throw new TypeError("Constructor expected store type to be 'indexedDB', 'localStorage', 'map', or 'redis'.");
    }

    this._inWorker = _inWorker;
    this._disableCacheInvalidation = disableCacheInvalidation;
    if (indexedDBOptions && isPlainObject(indexedDBOptions)) this._indexedDBOptions = indexedDBOptions;

    this._maxHeapSize = DefaultCachemap._calcMaxHeapSize(
      storeType,
      process.env.WEB_ENV ? maxHeapSize.client : maxHeapSize.server,
    );

    this._maxHeapThreshold = DefaultCachemap._calcMaxHeapThreshold(this._maxHeapSize);
    this._mockRedis = isBoolean(mockRedis) ? mockRedis : false;
    this._name = name;
    if (!this._disableCacheInvalidation) this._reaper = new Reaper(this, reaperOptions);
    if (redisOptions && isPlainObject(redisOptions)) this._redisOptions = redisOptions;
    if (isBoolean(sharedCache)) this._sharedCache = sharedCache;
    this._storeType = storeType;
    if (isFunction(sortComparator)) DefaultCachemap._sortComparator = sortComparator;
  }

  /**
   * The property holds the metadata for each data
   * entry in the DefaultCachemap instance.
   *
   */
  get metadata(): Metadata[] {
    return this._metadata;
  }

  /**
   * The property holds the name of the store type the
   * DefaultCachemap is using.
   *
   */
  get storeType(): string {
    return this._storeType;
  }

  /**
   * The property holds the approximate amount of
   * memory the DefaultCachemap instance as used.
   *
   */
  get usedHeapSize(): number {
    return this._usedHeapSize;
  }

  /**
   * The method removes all data entries from the
   * DefaultCachemap instance.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5]);
   * await cachemap.clear();
   *
   * const size = await cachemap.size();
   * // size is 0;
   * ```
   *
   */
  public async clear(): Promise<void> {
    try {
      this._store.clear();
      this._metadata = [];
      this._processing = [];
      this._usedHeapSize = 0;
      this._backupMetadata();
    } catch (error) {
      Promise.reject(error);
    }
  }

  /**
   * The method removes a specific data entry from the
   * DefaultCachemap instance.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5]);
   *
   * const isDeleted = await cachemap.delete("alfa");
   * // isDeleted is true
   *
   * const size = await cachemap.size();
   * // size is 0;
   * ```
   *
   */
  public async delete(key: string, opts: { hash?: boolean } = {}): Promise<boolean> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("Delete expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("Delete expected opts to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);
    const _key = opts.hash ? DefaultCachemap._hash(key) : key;

    try {
      const deleted = await this._store.delete(_key);
      if (!deleted) return false;
      await this._deleteMetadata(_key);
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * If a list of keys is provided, the method retrieves the
   * requested key/value pairs, while if no list is provided it retrieves
   * all key/value pairs in the instance of the DefaultCachemap.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5]);
   * await cachemap.set("bravo", [6, 7, 8, 9, 10]);
   *
   * const entries = await cachemap.entries();
   * // entries is [["alfa", [1, 2, 3, 4, 5]], ["bravo", [6, 7, 8, 9, 10]]]
   * ```
   *
   */
  public async entries(keys?: string[]): Promise<Array<[string, any]>> {
    if (keys && !isArray(keys)) {
      Promise.reject(new TypeError("Entries expected keys to be an array"));
    }

    try {
      return this._entries(keys);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * If a list of keys is provided, the method retreives the
   * requested entries and metadata, while if no list is provided
   * it retrieves all entries and metadata in the instance of
   * the DefaultCachemap.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5]);
   * await cachemap.set("bravo", [6, 7, 8, 9, 10]);
   *
   * const exported = await cachemap.export();
   * // exported.entries is [["alfa", [1, 2, 3, 4, 5]], ["bravo", [6, 7, 8, 9, 10]]]
   * ```
   *
   */
  public async export(opts?: { keys?: string[], tag?: any }): Promise<ExportResult> {
    let keys: string[] | undefined;
    let metadata = this._metadata;

    if (opts) {
      if (!isPlainObject(opts)) {
        Promise.reject(new TypeError("Export expected opts to be an plain object."));
      }

      if (opts.keys && !isArray(opts.keys)) {
        Promise.reject(new TypeError("Export expected opts.keys to be an array."));
      }

      if (opts.tag) {
        metadata = this._metadata.filter((value) => value.tags.includes(opts.tag));
        keys = metadata.map((value) => value.key);
      } else if (opts.keys) {
        const optsKeys = opts.keys;
        keys = optsKeys;
        metadata = this._metadata.filter((value) => optsKeys.includes(value.key));
      }
    }

    return { entries: await this._entries(keys), metadata };
  }

  /**
   * The method retrieves a data entry from the DefaultCachemap
   * instance.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5]);
   *
   * const entry = await cachemap.get("alfa");
   * // entry is [1, 2, 3, 4, 5]
   * ```
   *
   */
  public async get(key: string, opts: { hash?: boolean } = {}): Promise<any> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("Get expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("Get expected opts to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);
    const _key = opts.hash ? DefaultCachemap._hash(key) : key;

    try {
      const value = await this._store.get(_key);
      if (!value) return undefined;
      await this._updateMetadata(_key);
      return value;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * The method retrieves the cache metadata for a data
   * entry or returns false if no matching data entry is found.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5], {
   *   cacheHeaders: { cacheControl: "public, max-age=5" },
   * });
   *
   * const hasEntry = await cachemap.has("alfa");
   * // hasEntry is instanceof Cacheability
   *
   * // Six seconds elapse...
   *
   * const stillHasEntry = await cachemap.has("alfa", { deleteExpired: true });
   * // stillHasEntry is false
   * ```
   *
   */
  public async has(
    key: string,
    opts: { deleteExpired?: boolean, hash?: boolean } = {},
  ): Promise<Cacheability | false> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("Has expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("Has expected opts to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);
    const _key = opts.hash ? DefaultCachemap._hash(key) : key;

    try {
      const exists = await this._store.has(_key);
      if (!exists) return false;

      if (opts.deleteExpired && !this._checkMetadata(_key)) {
        await this.delete(_key);
        return false;
      }

      return this._getCacheability(_key) || false;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * The method imports the cache entries and metadata exported
   * from another instance of the DefaultCachemap.
   *
   * ```typescript
   * const exported = await cachemapAlfa.export();
   * await cachemapBravo.import(exported);
   * ```
   *
   */
  public async import(exported: ImportArgs): Promise<void> {
    if (!isPlainObject(exported)) {
      return Promise.reject("Import expected exported to be a plain object.");
    }

    const { entries, metadata } = exported;
    const errors: TypeError[] = [];

    if (!isArray(entries)) {
      errors.push(new TypeError("Import expected entries to be an array."));
    }

    if (!isArray(metadata)) {
      errors.push(new TypeError("Import expected metadata to be an array."));
    }

    if (errors.length) return Promise.reject(errors);
    let filterd: Metadata[];

    if (this._metadata.length) {
      filterd = this._metadata.filter((valueOne) => !metadata.find((valueTwo) => valueOne.key === valueTwo.key));
    } else {
      filterd = this._metadata;
    }

    try {
      await this._store.import(entries);
      this._metadata = convertCacheability([...filterd, ...metadata]);
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

  /**
   * The method adds a data entry to the DefaultCachemap
   * instance.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5], {
   *   cacheHeaders: { cacheControl: "public, max-age=5" },
   *   hash: true,
   * });
   *
   * const size = await cachemap.size();
   * // size is 1
   * ```
   *
   */
  public async set(
    key: string,
    value: any,
    opts: { cacheHeaders?: CacheHeaders, hash?: boolean, tag?: any } = {},
  ): Promise<void> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("Set expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("Set expected opts to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);
    const cacheHeaders = opts.cacheHeaders || {};
    const cacheability = new Cacheability();
    const metadata = cacheability.parseHeaders(cacheHeaders);
    const cacheControl = metadata.cacheControl;
    if (cacheControl.noStore || (this._sharedCache && cacheControl.private)) return;
    const _key = opts.hash ? DefaultCachemap._hash(key) : key;
    const processing = this._processing.includes(_key);
    if (!processing) this._processing.push(_key);
    const processed = () => this._processing = this._processing.filter((val) => val !== _key);

    try {
      const exists = await this._store.has(_key) || processing;
      await this._store.set(_key, value);

      if (exists) {
        await this._updateMetadata(_key, sizeof(value), cacheability, opts.tag);
      } else {
        await this._addMetadata(_key, sizeof(value), cacheability, opts.tag);
      }

      processed();
    } catch (error) {
      processed();
      return Promise.reject(error);
    }
  }

  /**
   * The method gets the number of data entries in the
   * DefaultCachemap instance.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5]);
   *
   * const size = await cachemap.size();
   * // size is 1
   * ```
   *
   */
  public async size(): Promise<number> {
    try {
      return this._store.size();
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

  private async _backupMetadata(): Promise<void> {
    if (this._storeType !== "map") {
      try {
        await this._store.set("metadata", this._metadata);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }

  private _calcReductionChunk(): number | undefined {
    const reductionSize = Math.round(this._maxHeapThreshold * 0.2);
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

  private _checkMetadata(key: string): boolean {
    if (this._disableCacheInvalidation) return true;
    const metadata = this._getMetadataEntry(key);
    if (!metadata) return false;
    return metadata.cacheability.checkTTL();
  }

  private async _createStore(): Promise<void> {
    if (this._storeType === "map") {
      this._store = new MapProxy(this._name);
      return;
    }

    try {
      if (!process.env.WEB_ENV) {
        this._store = new redisProxy(this._name, this._redisOptions, this._mockRedis);
      } else {
        if (this._storeType === "indexedDB" && this._supportsIndexedDB()) {
          this._store = await IndexedDBProxy.create(this._name, this._indexedDBOptions);
        } else if (this._storeType === "indexedDB" && this._supportsLocalStorage()) {
          this._storeType = "localStorage";
          this._store = new LocalStorageProxy(this._name);
          this._maxHeapSize = DefaultCachemap._calcMaxHeapSize(this._storeType);
          this._maxHeapThreshold = DefaultCachemap._calcMaxHeapThreshold(this._maxHeapSize);
        } else if (this._storeType === "localStorage" && this._supportsLocalStorage()) {
          this._store = new LocalStorageProxy(this._name);
        } else {
          this._storeType = "map";
          this._store = new MapProxy(this._name);
          this._maxHeapSize = DefaultCachemap._calcMaxHeapSize(this._storeType);
          this._maxHeapThreshold = DefaultCachemap._calcMaxHeapThreshold(this._maxHeapSize);
        }
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private async _deleteMetadata(key: string): Promise<void> {
    const index = this._metadata.findIndex((value) => value.key === key);
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
    try {
      const _keys = !keys && this._storeType === "redis" ? this._metadata.map((value) => value.key) : keys;
      return this._store.entries(_keys);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _getCacheability(key: string): Cacheability | undefined {
    const entry = this._getMetadataEntry(key);
    if (!entry) return undefined;
    return entry.cacheability;
  }

  private _getMetadataEntry(key: string): Metadata | undefined {
    return this._metadata.find((value) => value.key === key);
  }

  private async _reduceHeapSize(): Promise<void> {
    const index = this._calcReductionChunk();
    if (!index) return;
    this._reaper.cull(this._metadata.slice(index, this._metadata.length));
  }

  private async _retreiveMetadata(): Promise<void> {
    try {
      const metadata: Metadata[] = await this._store.get(`metadata`);
      if (isArray(metadata)) {
        this._metadata = convertCacheability(metadata);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _sortMetadata(): void {
    this._metadata.sort(DefaultCachemap._sortComparator);
  }

  private _supportsIndexedDB(): boolean {
    return self.indexedDB && (!this._inWorker || supportsWorkerIndexedDB(self.navigator.userAgent));
  }

  private _supportsLocalStorage(): boolean {
    return !this._inWorker && self instanceof Window && !!self.localStorage;
  }

  private _updateHeapSize(): void {
    this._usedHeapSize = this._metadata.reduce((acc, value) => (acc + value.size), 0);
    if (!this._disableCacheInvalidation && this._usedHeapSize > this._maxHeapThreshold) this._reduceHeapSize();
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
