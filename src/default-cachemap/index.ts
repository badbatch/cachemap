import { Cacheability } from "cacheability";
import { isArray, isBoolean, isFunction, isPlainObject, isString } from "lodash";
import * as md5 from "md5";
import * as sizeof from "object-sizeof";
import { ClientOpts } from "redis";
import IndexedDBProxy from "./proxies/indexed-db";
import LocalStorageProxy from "./proxies/local-storage";
import MapProxy from "./proxies/map";
import RedisProxy from "./proxies/redis";
import Reaper from "./reaper";

import {
  CacheHeaders,
  ConstructorArgs,
  IndexedDBOptions,
  Metadata,
  StoreProxyTypes,
  StoreTypes,
} from "../types";

let redisProxy: typeof RedisProxy;

if (!process.env.WEB_ENV) {
  redisProxy = require("./proxies/redis").default;
}

/**
 * An isomorphic cache that works on the server and the
 * browser, that can use Redis, LocalStorage, IndexedDB
 * or an in-memory Map.
 *
 * ```typescript
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
   * the WEB_ENV environment variable is set to "true".
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
  private _environment: "node" | "web";
  private _indexedDBOptions?: IndexedDBOptions;
  private _maxHeapSize: number;
  private _maxHeapThreshold: number;
  private _metadata: Metadata[] = [];
  private _mockRedis: boolean;
  private _name: string;
  private _reaper: Reaper;
  private _redisOptions?: ClientOpts;
  private _store: StoreProxyTypes;
  private _storeType: StoreTypes;
  private _usedHeapSize: number = 0;

  constructor(args: ConstructorArgs) {
    if (!isPlainObject(args)) {
      throw new TypeError("constructor expected args to ba a plain object.");
    }

    const {
      disableCacheInvalidation = false,
      indexedDBOptions,
      maxHeapSize = {},
      mockRedis,
      name,
      reaperOptions,
      redisOptions,
      sortComparator,
      use = {},
    } = args;

    const errors: TypeError[] = [];

    if (!isString(name)) {
      errors.push(new TypeError("constructor expected name to be a string."));
    }

    if (!isPlainObject(maxHeapSize)) {
      errors.push(new TypeError("constructor expected maxHeapSize to be a plain object."));
    }

    if (!isPlainObject(use)) {
      errors.push(new TypeError("constructor expected use to be a plain object."));
    }

    if (errors.length) throw errors;
    const storeType = DefaultCachemap._getStoreType(process.env.WEB_ENV ? use.client : use.server);

    if (!DefaultCachemap._storeTypes.find((type) => type === storeType)) {
      throw new TypeError("constructor expected store type to be 'indexedDB', 'localStorage', 'map', or 'redis'.");
    }

    this._disableCacheInvalidation = disableCacheInvalidation;
    this._environment = process.env.WEB_ENV ? "web" : "node";
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
   * const size = await cachemap.size();
   * // size is 0;
   * ```
   *
   */
  public async clear(): Promise<void> {
    try {
      this._store.clear();
      this._metadata = [];
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
   * const isDeleted = await cachemap.delete("alfa");
   * // isDeleted is true
   * const size = await cachemap.size();
   * // size is 0;
   * ```
   *
   */
  public async delete(key: string, opts: { hash?: boolean, stub?: boolean } = {}): Promise<boolean> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("delete expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("delete expected opts to be a plain object."));
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
   * The method retrievs a data entry from the DefaultCachemap
   * instance.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5]);
   * const entry = await cachemap.get("alfa");
   * // entry is [1, 2, 3, 4, 5]
   * ```
   *
   */
  public async get(key: string, opts: { hash?: boolean, stub?: boolean } = {}): Promise<any> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("get expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("get expected opts to be a plain object."));
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
   * The method retrievs the cache metadata for a data
   * entry or returns false if no matching data entry is found.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5], {
   *   cacheHeaders: { cacheControl: "public, max-age=5" },
   * });
   * const hasEntry = await cachemap.has("alfa");
   * // hasEntry is instanceof Cacheability
   * // Six seconds elapse...
   * const stillHasEntry = await cachemap.has("alfa", { deleteExpired: true });
   * // stillHasEntry is false
   * ```
   *
   */
  public async has(
    key: string,
    opts: { deleteExpired?: boolean, hash?: boolean, stub?: boolean } = {},
  ): Promise<Cacheability | false> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("has expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("has expected opts to be a plain object."));
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
   * The method adds a data entry to the DefaultCachemap
   * instance.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5], {
   *   cacheHeaders: { cacheControl: "public, max-age=5" },
   *   hash: true,
   * });
   * const size = await cachemap.size();
   * // size is 1
   * ```
   *
   */
  public async set(
    key: string,
    value: any,
    opts: { cacheHeaders?: CacheHeaders, hash?: boolean, stub?: boolean } = {},
  ): Promise<void> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("set expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("set expected opts to be a plain object."));
    }

    if (errors.length) return Promise.reject(errors);
    const cacheHeaders = opts.cacheHeaders || {};
    const cacheability = new Cacheability();
    const metadata = cacheability.parseHeaders(cacheHeaders);
    const cacheControl = metadata.cacheControl;
    if (cacheControl.noStore || (this._environment === "node" && cacheControl.private)) return;
    const _key = opts.hash ? DefaultCachemap._hash(key) : key;

    try {
      const exists = await this._store.has(_key);
      await this._store.set(_key, value);

      if (exists) {
        await this._updateMetadata(_key, sizeof(value), cacheability);
      } else {
        await this._addMetadata(_key, sizeof(value), cacheability);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * The method gets the number of data entries in the
   * DefaultCachemap instance.
   *
   * ```typescript
   * await cachemap.set("alfa", [1, 2, 3, 4, 5]);
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

  private async _addMetadata(key: string, size: number, cacheability: Cacheability): Promise<void> {
    this._metadata.push({
      accessedCount: 0,
      added: Date.now(),
      cacheability,
      key,
      lastAccessed: Date.now(),
      lastUpdated: Date.now(),
      size,
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
      this._store = new MapProxy();
      return;
    }

    try {
      if (!process.env.WEB_ENV) {
        this._store = new redisProxy(this._redisOptions, this._mockRedis);
      } else {
        if (this._storeType === "indexedDB" && self.indexedDB) {
          this._store = await IndexedDBProxy.create(this._indexedDBOptions);
        } else if (self instanceof Window && self.localStorage) {
          this._store = new LocalStorageProxy(this._name);
        } else {
          this._storeType = "map";
          this._store = new MapProxy();
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
        this._metadata = metadata.map((entry) => {
          const cacheability = new Cacheability();
          cacheability.metadata = entry.cacheability.metadata;
          entry.cacheability = cacheability;
          return entry;
        });
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private _sortMetadata(): void {
    this._metadata.sort(DefaultCachemap._sortComparator);
  }

  private _updateHeapSize(): void {
    this._usedHeapSize = this._metadata.reduce((acc, value) => (acc + value.size), 0);
    if (!this._disableCacheInvalidation && this._usedHeapSize > this._maxHeapThreshold) this._reduceHeapSize();
  }

  private async _updateMetadata(key: string, size?: number, cacheability?: Cacheability): Promise<void> {
    const entry = this._getMetadataEntry(key);
    if (!entry) return;

    if (size) {
      entry.size = size;
      entry.lastUpdated = Date.now();
    } else {
      entry.accessedCount += 1;
      entry.lastAccessed = Date.now();
    }

    if (cacheability) entry.cacheability = cacheability;
    this._sortMetadata();
    this._updateHeapSize();

    try {
      await this._backupMetadata();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
