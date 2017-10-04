import Cacheability from 'cacheability';
import { isFunction, get } from 'lodash';
import md5 from 'md5';
import sizeof from 'object-sizeof';
import logger from './logger';
import Reaper from './reaper';

require('es6-promise').polyfill();

/**
 *
 * The cachemap
 */
export default class Cachemap {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {void}
   */
  constructor({
    /**
     * Optional function used to compare meta data
     * as part of the sorting process.
     *
     * @type {Function}
     */
    comparator = null,
    /**
     * Optional flag to disable cache invalidation.
     *
     * @type {boolean}
     */
    disableCacheInvalidation,
    /**
     * Optional configuration settings for localStorage.
     *
     * @type {Object}
     */
    localStorageOptions = {},
    /**
     * Optional maximum amount of memory the cachemap can use.
     *
     * @type {number}
     */
    maxHeapSize = 4194304,
    /**
     * Name of the cachemap, used for logging and
     * as part of the metadata storage key.
     *
     * @type {string}
     */
    name = 'cachemap',
    /**
     * Optional configuration settings for redis.
     *
     * @type {Object}
     */
    redisOptions = { db: 0 },
    /**
     * Optional configuration settings for the reaper.
     *
     * @type {Object}
     */
    reaperOptions,
    /**
     * Optional type to specify Map rather than
     * use LocalStorage or Redis.
     *
     * @type {string}
     */
    storageType,
  } = {}) {
    if (isFunction(comparator)) this._comparator = comparator;
    this._disableCacheInvalidation = disableCacheInvalidation;
    this._maxHeapSize = maxHeapSize;
    this._name = name;
    this._reaper = new Reaper(this, reaperOptions);

    if (storageType === 'map') {
      this._env = process.env.WEB_ENV ? 'web' : 'node';
      const MapProxy = require('./map-proxy').default; // eslint-disable-line global-require
      this._storageType = storageType;
      this._store = new MapProxy();
    } else {
      if (process.env.WEB_ENV) { // eslint-disable-line no-lonely-if
        this._env = 'web';
        const LocalStorageProxy = require('./local-storage-proxy').default; // eslint-disable-line global-require
        this._storageType = 'local';
        this._store = new LocalStorageProxy(localStorageOptions);
      } else {
        this._env = 'node';
        const RedisProxy = require('./redis-proxy').default; // eslint-disable-line global-require
        this._storageType = 'redis';
        this._store = new RedisProxy({ name, options: redisOptions });
      }

      this._getStoredMetadata();
    }
  }

  /**
   *
   * @private
   * @type {Array<Object>}
   */
  _metadata = [];

  /**
   *
   * @private
   * @type {number}
   */
  _usedHeapSize = 0;

  /**
   *
   * @return {Array<Object>}
   */
  get metadata() {
    return this._metadata;
  }

  /**
   *
   * @return {number}
   */
  get usedHeapSize() {
    return this._usedHeapSize;
  }

  /**
   *
   * @private
   * @param {string} key
   * @param {number} size
   * @param {Object} cacheMetadata
   * @return {void}
   */
  _addMetadata(key, size, cacheMetadata) {
    this._metadata.push({
      accessedCount: 0,
      added: Date.now(),
      cacheability: cacheMetadata,
      key,
      lastAccessed: null,
      lastUpdated: null,
      size,
    });

    this._sortMetadata();
    this._updateHeapSize();
    this._storeMetadata();
  }

  /**
   *
   * @private
   * @return {number}
   */
  _calcReductionChunk() {
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
  _checkHeapThreshold() {
    if (this._usedHeapSize > this._maxHeapSize) this._reduceHeapSize();
  }

  /**
   *
   * @private
   * @param {string} key
   * @return {boolean}
   */
  _checkMetadata(key) {
    if (this._disableCacheInvalidation) return true;
    const { cacheability } = this._getMetadataValue(key);
    return cacheability.checkTTL();
  }

  /**
   *
   * @private
   * @param {Object} a
   * @param {Object} b
   * @return {number}
   */
  _comparator(a, b) {
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

  /**
   *
   * @private
   * @param {string} key
   * @return {void}
   */
  _deleteMetadata(key) {
    const index = this._metadata.findIndex(value => value.key === key);
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
  _getMetadataValue(key) {
    return this._metadata.find(value => value.key === key);
  }

  /**
   *
   * @private
   * @return {Promise}
   */
  async _getStoredMetadata() {
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
  async _reduceHeapSize() {
    const index = this._calcReductionChunk();
    this._reaper.cull(this._metadata.slice(index, this._metadata.length));
  }

  /**
   *
   * @private
   * @return {Promise}
   */
  async _storeMetadata() {
    if (this._storageType === 'map') return;
    this._store.set(`${this._name} metadata`, JSON.stringify(this._metadata));
  }

  /**
   *
   * @private
   * @return {void}
   */
  _sortMetadata() {
    this._metadata.sort(this._comparator);
  }

  /**
   *
   * @private
   * @return {number}
   */
  _updateHeapSize() {
    this._usedHeapSize = this._metadata.reduce((acc, value) => (acc + value.size), 0);
    if (this._maxHeapSize) this._checkHeapThreshold();
  }

  /**
   *
   * @private
   * @param {string} key
   * @param {number} [size]
   * @param {Parser} [cacheability]
   * @return {void}
   */
  _updateMetadata(key, size, cacheability) {
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
  async clear() {
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
  async delete(key, { hash = false } = {}) {
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
  async forEach(callback) {
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
  async get(key, { hash = false, parse = true } = {}) {
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
    if (parse && this._storageType !== 'map') value = JSON.parse(value);
    return value;
  }

  /**
   *
   * @param {string} key
   * @return {Object}
   */
  getCacheability(key) {
    const entry = this._getMetadataValue(key);
    return get(entry, ['cacheability'], null);
  }

  /**
   *
   * @param {any} key
   * @param {Object} [opts]
   * @param {boolean} [opts.deleteExpired]
   * @param {boolean} [opts.hash]
   * @return {Promise}
   */
  async has(key, { deleteExpired = false, hash = false } = {}) {
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
  hash(value) {
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
  async set(key, value, { cacheHeaders = {}, hash = false, stringify = true } = {}) {
    const cacheability = new Cacheability();
    const cacheMetadata = cacheability.parseHeaders(cacheHeaders);
    const cacheControl = cacheMetadata.cacheControl || {};
    if (cacheControl.noStore || (this._env === 'node' && cacheControl.private)) return false;
    let _key = key;
    if (hash) _key = this.hash(_key);
    let _value = value;
    if (stringify && this._storageType !== 'map') _value = JSON.stringify(_value);
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
  async size() {
    return this._store.size();
  }
}
