import Cacheability from "cacheability";
import { polyfill } from "es6-promise";
import "isomorphic-fetch";
import { get, isFunction, isPlainObject, isString } from "lodash";
import md5 from "md5";
import sizeof from "object-sizeof";
import { ClientOpts } from "redis";
import MapProxy from "./proxies/map";
import Reaper from "./reaper";

import {
  CachemapArgs,
  Metadata,
  StoreProxyTypes,
  StoreTypes,
} from "./types";

polyfill();

export default class Cachemap {
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

  private static _getStore(storeType: StoreTypes, redisOptions?: ClientOpts): StoreProxyTypes {
    let storeProxy: StoreProxyTypes;

    if (storeType === "map") {
      storeProxy = new MapProxy();
    }

    if (process.env.WEB_ENV) {
      if (storeType === "indexedDB") {
        const indexedDBProxy = require("./proxies/indexed-db").default;
        storeProxy = new indexedDBProxy();
      } else {
        const localStorageProxy = require("./proxies/local-storage").default;
        storeProxy = new localStorageProxy();
      }
    } else {
      const redisProxy = require("./proxies/redis").default;
      storeProxy = new redisProxy(redisOptions);
    }

    return storeProxy;
  }

  private static _getStoreType(storeType?: StoreTypes): StoreTypes {
    return storeType || "map";
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
  private _metadata: Metadata[] = [];
  private _name: string;
  private _reaper: Reaper;
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

    if (!isString(name)) {
      throw new TypeError("constructor expected name to be a string.");
    }

    if (!isPlainObject(maxHeapSize)) {
      throw new TypeError("constructor expected maxHeapSize to be a plain object.");
    }

    if (!isPlainObject(use)) {
      throw new TypeError("constructor expected use to be a plain object.");
    }

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

    this._name = name;
    this._reaper = new Reaper(this, reaperOptions);
    this._store = Cachemap._getStore(storeType, redisOptions);
    this._storeType = storeType;
    if (isFunction(sortComparator)) Cachemap._sortComparator = sortComparator;
    this._getStoredMetadata();
  }

  get metadata(): Metadata[] {
    return this._metadata;
  }

  get usedHeapSize(): number {
    return this._usedHeapSize;
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
    this._storeMetadata();
  }

  private _sortMetadata(): void {
    this._metadata.sort(Cachemap._sortComparator);
  }

  private async _storeMetadata(): Promise<void> {
    if (this._storeType !== "map") {
      this._store.set(`${this._name} metadata`, this._metadata);
    }
  }

  private _updateHeapSize(): void {
    this._usedHeapSize = this._metadata.reduce((acc, value) => (acc + value.size), 0);
    this._checkHeapThreshold();
  }

  /**
   *
   * @private
   * @return {number}
   */
  public _calcReductionChunk() {
    const reductionSize = Math.round(this._maxHeapSize * 0.2);
    let chunkSize = 0;
    let index;

    for (let i = this._metadata.length - 1; i >= 0; i -= 1) {
      chunkSize += this._metadata[i].size;

      if (chunkSize > reductionSize) {
        index = i;
        break;
      }
    }

    return index;
  }

  /**
   *
   * @private
   * @return {void}
   */
  public _checkHeapThreshold() {
    if (this._usedHeapSize > this._maxHeapSize) this._reduceHeapSize();
  }

  /**
   *
   * @private
   * @param {string} key
   * @return {boolean}
   */
  public _checkMetadata(key) {
    if (this._disableCacheInvalidation) return true;
    const { cacheability } = this._getMetadataValue(key);
    return cacheability.checkTTL();
  }

  /**
   *
   * @private
   * @param {string} key
   * @return {void}
   */
  public _deleteMetadata(key) {
    const index = this._metadata.findIndex((value) => value.key === key);
    this._metadata.splice(index, 1);
    this._sortMetadata();
    this._updateHeapSize();
    this._storeMetadata();
  }

  /**
   *
   * @private
   * @param {string} key
   * @return {Object}
   */
  public _getMetadataValue(key) {
    return this._metadata.find((value) => value.key === key);
  }

  /**
   *
   * @private
   * @return {Promise}
   */
  public async _getStoredMetadata() {
    let metadata;

    try {
      metadata = await this._store.get(`${this._name} metadata`);
    } catch (err) {
      logger.error(err);
    }

    if (metadata) this._metadata = JSON.parse(metadata);
  }

  /**
   *
   * @private
   * @return {Promise}
   */
  public async _reduceHeapSize() {
    const index = this._calcReductionChunk();
    this._reaper.cull(this._metadata.slice(index, this._metadata.length));
  }

  /**
   *
   * @private
   * @param {string} key
   * @param {number} [size]
   * @param {Parser} [cacheability]
   * @return {void}
   */
  public _updateMetadata(key, size, cacheability) {
    const entry = this._getMetadataValue(key);

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
    this._storeMetadata();
  }

  /**
   *
   * @return {Promise}
   */
  public async clear() {
    this._store.clear();
    this._metadata = [];
    this._storeMetadata();
    this._usedHeapSize = 0;
  }

  /**
   *
   * @param {any} key
   * @param {Object} [opts]
   * @return {Promise}
   */
  public async delete(key, { hash = false } = {}) {
    let _key = key;
    if (hash) _key = this.hash(_key);
    let hasDel;

    try {
      hasDel = await this._store.delete(_key);
    } catch (err) {
      logger.error(err);
    }

    if (!hasDel) return false;
    this._deleteMetadata(_key);
    return true;
  }

  /**
   *
   * @param {Function} callback
   * @return {void}
   */
  public async forEach(callback) {
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

  /**
   *
   * @param {any} key
   * @param {Object} [opts]
   * @return {Promise}
   */
  public async get(key, { hash = false, parse = true } = {}) {
    let _key = key;
    if (hash) _key = this.hash(_key);
    let value;

    try {
      value = await this._store.get(_key);
    } catch (err) {
      logger.error(err);
    }

    if (!value) return null;
    this._updateMetadata(_key);
    if (parse && this._storageType !== "map") value = JSON.parse(value);
    return value;
  }

  /**
   *
   * @param {string} key
   * @return {Object}
   */
  public getCacheability(key) {
    const entry = this._getMetadataValue(key);
    return get(entry, ["cacheability"], null);
  }

  /**
   *
   * @param {any} key
   * @param {Object} [opts]
   * @param {boolean} [opts.deleteExpired]
   * @param {boolean} [opts.hash]
   * @return {Promise}
   */
  public async has(key, { deleteExpired = false, hash = false } = {}) {
    let _key = key;
    if (hash) _key = this.hash(_key);
    let hasKey;

    try {
      hasKey = await this._store.has(_key);
    } catch (err) {
      logger.error(err);
    }

    if (!hasKey) return false;

    if (deleteExpired && !this._checkMetadata(_key)) {
      await this.delete(_key);
      return false;
    }

    return this.getCacheability(_key);
  }

  /**
   *
   * @param {any} value
   * @return {string}
   */
  public hash(value) {
    return md5(value);
  }

  /**
   *
   * @param {any} key
   * @param {any} value
   * @param {Object} [opts]
   * @param {Object} [opts.cacheHeaders]
   * @param {boolean} [opts.hash]
   * @param {boolean} [opts.stringify]
   * @return {Promise}
   */
  public async set(key, value, { cacheHeaders = {}, hash = false, stringify = true } = {}) {
    const cacheability = new Cacheability();
    const cacheMetadata = cacheability.parseHeaders(cacheHeaders);
    const cacheControl = cacheMetadata.cacheControl || {};
    if (cacheControl.noStore || (this._env === "node" && cacheControl.private)) return false;
    let _key = key;
    if (hash) _key = this.hash(_key);
    let _value = value;
    if (stringify && this._storageType !== "map") _value = JSON.stringify(_value);
    let hasKey, setValue;

    try {
      hasKey = await this._store.has(_key);
      setValue = await this._store.set(_key, _value);
    } catch (err) {
      logger.error(err);
    }

    if (!setValue) return false;

    if (hasKey) {
      this._updateMetadata(_key, sizeof(_value), cacheability);
    } else {
      this._addMetadata(_key, sizeof(_value), cacheability);
    }

    return true;
  }

  /**
   *
   * @return {Promise}
   */
  public async size() {
    return this._store.size();
  }
}
