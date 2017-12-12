import Cacheability from "cacheability";
import { polyfill } from "es6-promise";
import "isomorphic-fetch";
import { isFunction, isPlainObject, isString } from "lodash";
import md5 from "md5";
import { sizeof } from "object-sizeof";
import { ClientOpts } from "redis";
import MapProxy from "./proxies/map";
import Reaper from "./reaper";

import {
  CacheHeaders,
  CachemapArgs,
  Metadata,
  StoreProxyTypes,
  StoreTypes,
} from "../types";

polyfill();

export default class Cachemap {
  public static async create(args: CachemapArgs): Promise<Cachemap> {
    const cachemap = new Cachemap(args);
    await cachemap._createStore();
    await cachemap._retreiveMetadata();
    return cachemap;
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
  private _maxHeapSize: number;
  private _maxHeapThreshold: number;
  private _metadata: Metadata[] = [];
  private _name: string;
  private _reaper: Reaper;
  private _redisOptions?: ClientOpts;
  private _store: StoreProxyTypes;
  private _storeType: StoreTypes;
  private _usedHeapSize: number = 0;

  constructor(args: CachemapArgs) {
    const {
      disableCacheInvalidation = false,
      maxHeapSize = {},
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
    const storeType = Cachemap._getStoreType(process.env.WEB_ENV ? use.client : use.server);

    if (!Cachemap._storeTypes.find((type) => type === storeType)) {
      throw new TypeError("constructor expected store type to be 'indexedDB', 'localStorage', 'map', or 'redis'.");
    }

    this._disableCacheInvalidation = disableCacheInvalidation;
    this._environment = process.env.WEB_ENV ? "web" : "node";

    this._maxHeapSize = Cachemap._calcMaxHeapSize(
      storeType,
      process.env.WEB_ENV ? maxHeapSize.client : maxHeapSize.server,
    );

    this._maxHeapThreshold = this._maxHeapSize !== Infinity ? (this._maxHeapSize * 0.8) : Infinity;
    this._name = name;
    this._reaper = new Reaper(this, reaperOptions);
    if (isPlainObject(redisOptions)) this._redisOptions = redisOptions;
    this._storeType = storeType;
    if (isFunction(sortComparator)) Cachemap._sortComparator = sortComparator;
  }

  get metadata(): Metadata[] {
    return this._metadata;
  }

  get usedHeapSize(): number {
    return this._usedHeapSize;
  }

  public async clear(): Promise<void> {
    this._store.clear();
    this._metadata = [];
    this._usedHeapSize = 0;
    this._backupMetadata();
  }

  public async delete(key: string, opts: { hash?: boolean } = {}): Promise<boolean> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("delete expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("delete expected opts to be a plain object."));
    }

    if (errors.length) throw errors;
    const _key = opts.hash ? Cachemap._hash(key) : key;
    let deleted = false;

    try {
      deleted = await this._store.delete(_key);
    } catch (error) {
      // no catch
    }

    if (!deleted) return false;
    this._deleteMetadata(_key);
    return true;
  }

  public async forEach(callback: (value: any, key: string, cacheability: Cacheability) => void): Promise<void> {
    await Promise.all(
      this._metadata.map(({ cacheability, key }) => {
        const promise = this.get(key);

        promise.then((value) => {
          callback(value, key, cacheability);
        });

        return promise;
      }),
    );
  }

  public async get(key: string, opts: { hash?: boolean } = {}): Promise<any> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("get expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("get expected opts to be a plain object."));
    }

    if (errors.length) throw errors;
    const _key = opts.hash ? Cachemap._hash(key) : key;
    let value: any;

    try {
      value = await this._store.get(_key);
    } catch (error) {
      // no catch
    }

    if (!value) return undefined;
    this._updateMetadata(_key);
    return value;
  }

  public async has(key: string, opts: { deleteExpired?: boolean, hash?: boolean } = {}): Promise<Cacheability | false> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("has expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("has expected opts to be a plain object."));
    }

    if (errors.length) throw errors;
    const _key = opts.hash ? Cachemap._hash(key) : key;
    let exists = false;

    try {
      exists = await this._store.has(_key);
    } catch (error) {
      // no catch
    }

    if (!exists) return false;

    if (opts.deleteExpired && !this._checkMetadata(_key)) {
      await this.delete(_key);
      return false;
    }

    return this._getCacheability(_key) || false;
  }

  public async set(
    key: string,
    value: any,
    opts: { cacheHeaders?: CacheHeaders, hash?: boolean } = {},
  ): Promise<void> {
    const errors: TypeError[] = [];

    if (!isString(key)) {
      errors.push(new TypeError("set expected key to be a string."));
    }

    if (!isPlainObject(opts)) {
      errors.push(new TypeError("set expected opts to be a plain object."));
    }

    if (errors.length) throw errors;
    const cacheability = new Cacheability();
    const metadata = cacheability.parseHeaders(new Headers(opts.cacheHeaders));
    const cacheControl = metadata.cacheControl;
    if (cacheControl.noStore || (this._environment === "node" && cacheControl.private)) return;
    const _key = opts.hash ? Cachemap._hash(key) : key;
    let exists = false;

    try {
      exists = await this._store.has(_key);
      await this._store.set(_key, value);
    } catch (error) {
      // no catch
    }

    if (exists) {
      this._updateMetadata(_key, sizeof(value), cacheability);
    } else {
      this._addMetadata(_key, sizeof(value), cacheability);
    }
  }

  public async size(): Promise<number> {
    return this._store.size();
  }

  private _addMetadata(key: string, size: number, cacheability: Cacheability): void {
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
    this._backupMetadata();
  }

  private async _backupMetadata(): Promise<void> {
    if (this._storeType !== "map") {
      this._store.set(`${this._name} metadata`, this._metadata);
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

    if (process.env.WEB_ENV) {
      if (this._storeType === "indexedDB" && window.indexedDB) {
        const indexedDBProxy = await import("./proxies/indexed-db");
        this._store = new indexedDBProxy.default();
      } else if (window.localStorage) {
        const module = await import("./proxies/local-storage");
        this._store = new module.default();
        this._storeType = "localStorage";
      } else {
        this._store = new MapProxy();
        this._storeType = "map";
      }
    } else {
      const module = await import("./proxies/redis");
      this._store = new module.default(this._redisOptions);
    }
  }

  private _deleteMetadata(key: string): void {
    const index = this._metadata.findIndex((value) => value.key === key);
    if (index === -1) return;
    this._metadata.splice(index, 1);
    this._sortMetadata();
    this._updateHeapSize();
    this._backupMetadata();
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
      this._metadata = await this._store.get(`${this._name} metadata`);
    } catch (error) {
      // no catch
    }
  }

  private _sortMetadata(): void {
    this._metadata.sort(Cachemap._sortComparator);
  }

  private _updateHeapSize(): void {
    this._usedHeapSize = this._metadata.reduce((acc, value) => (acc + value.size), 0);
    if (this._usedHeapSize > this._maxHeapThreshold) this._reduceHeapSize();
  }

  private _updateMetadata(key: string, size?: number, cacheability?: Cacheability): void {
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
    this._backupMetadata();
  }
}
