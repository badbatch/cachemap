import { isFunction, get } from 'lodash';
import md5 from 'md5';
import sizeof from 'object-sizeof';
import { parseCacheHeaders } from './helpers';
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
  } = {}) {
    if (isFunction(comparator)) this._comparator = comparator;
    this._disableCacheInvalidation = disableCacheInvalidation;

    if (process.env.WEB_ENV) {
      this._env = 'web';
      const LocalStorageProxy = require('./local-storage-proxy').default; // eslint-disable-line global-require
      this._map = new LocalStorageProxy(localStorageOptions);
      const { maxHeapSize } = localStorageOptions;
      this._maxHeapSize = maxHeapSize || 4194304;
      this._metaDataStorage = new LocalStorageProxy(localStorageOptions);
    } else {
      this._env = 'node';
      const RedisProxy = require('./redis-proxy').default; // eslint-disable-line global-require
      this._map = new RedisProxy({ name, options: redisOptions });

      this._metaDataStorage = new RedisProxy({
        name: `${name} metadata`,
        options: { ...redisOptions, ...{ db: redisOptions.db + 1 } },
      });
    }

    this._name = name;
    this._reaper = new Reaper(this, reaperOptions);
    this._getStoredMetaData();
  }

  /**
   *
   * @private
   * @type {number}
   */
  _maxHeapSize = 0;

  /**
   *
   * @private
   * @type {Array<Object>}
   */
  _metaData = [];

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
  get metaData() {
    return this._metaData;
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
  _addMetaData(key, size, cacheMetadata) {
    this._metaData.push({
      accessedCount: 0,
      added: Date.now(),
      cacheability: cacheMetadata,
      key,
      lastAccessed: null,
      lastUpdated: null,
      size,
    });

    this._sortMetaData();
    this._updateHeapSize();
    this._storeMetaData();
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

    for (let i = this._metaData.length - 1; i >= 0; i -= 1) {
      chunkSize += this._metaData[i].size;

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
  _checkMetaData(key) {
    if (this._disableCacheInvalidation) return true;
    const { cacheability } = this._getMetaDataValue(key);
    return cacheability.check();
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
  _deleteMetaData(key) {
    const index = this._metaData.findIndex(value => value.key === key);
    this._metaData.splice(index, 1);
    this._sortMetaData();
    this._updateHeapSize();
    this._storeMetaData();
  }

  /**
   *
   * @private
   * @param {string} key
   * @return {Object}
   */
  _getMetaDataValue(key) {
    return this._metaData.find(value => value.key === key);
  }

  /**
   *
   * @private
   * @return {Promise}
   */
  async _getStoredMetaData() {
    let metaData;

    try {
      metaData = await this._metaDataStorage.get(`${this._name} metaData`);
    } catch (err) {
      logger.error(err);
    }

    if (metaData) this._metaData = JSON.parse(metaData);
  }

  /**
   *
   * @private
   * @return {Promise}
   */
  async _reduceHeapSize() {
    const index = this._calcReductionChunk();
    this._reaper.cull(this._metaData.slice(index, this._metaData.length));
  }

  /**
   *
   * @private
   * @return {Promise}
   */
  async _storeMetaData() {
    this._metaDataStorage.set(`${this._name} metaData`, JSON.stringify(this._metaData));
  }

  /**
   *
   * @private
   * @return {void}
   */
  _sortMetaData() {
    this._metaData.sort(this._comparator);
  }

  /**
   *
   * @private
   * @return {number}
   */
  _updateHeapSize() {
    this._usedHeapSize = this._metaData.reduce((acc, value) => (acc + value.size), 0);
    if (this._maxHeapSize) this._checkHeapThreshold();
  }

  /**
   *
   * @private
   * @param {string} key
   * @param {number} [size]
   * @param {Object} [cacheMetadata]
   * @return {void}
   */
  _updateMetaData(key, size, cacheMetadata) {
    const entry = this._getMetaDataValue(key);

    if (size) {
      entry.size = size;
      entry.lastUpdated = Date.now();
    } else {
      entry.accessedCount += 1;
      entry.lastAccessed = Date.now();
    }

    if (cacheMetadata) entry.cacheability = cacheMetadata;
    this._sortMetaData();
    this._updateHeapSize();
    this._storeMetaData();
  }

  /**
   *
   * @return {Promise}
   */
  async clear() {
    this._map.clear();
    this._metaData = [];
    this._storeMetaData();
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
      hasDel = await this._map.delete(_key);
    } catch (err) {
      logger.error(err);
    }

    if (!hasDel) return false;
    this._deleteMetaData(_key);
    return true;
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
      value = await this._map.get(_key);
    } catch (err) {
      logger.error(err);
    }

    if (!value) return null;
    this._updateMetaData(_key);
    if (parse) value = JSON.parse(value);
    return value;
  }

  /**
   *
   * @param {string} key
   * @return {Object}
   */
  getCacheability(key) {
    const entry = this._getMetaDataValue(key);
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
      hasKey = await this._map.has(_key);
    } catch (err) {
      logger.error(err);
    }

    if (!hasKey) return false;

    if (deleteExpired && !this._checkMetaData(_key)) {
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
    const cacheMetadata = parseCacheHeaders(cacheHeaders);
    if (cacheMetadata.noStore || (this._env === 'node' && cacheMetadata.private)) return false;
    let _key = key;
    if (hash) _key = this.hash(_key);
    let _value = value;
    if (stringify) _value = JSON.stringify(_value);
    let hasKey, setValue;

    try {
      hasKey = await this._map.has(_key);
      setValue = await this._map.set(_key, _value);
    } catch (err) {
      logger.error(err);
    }

    if (!setValue) return false;

    if (hasKey) {
      this._updateMetaData(_key, sizeof(_value), cacheMetadata);
    } else {
      this._addMetaData(_key, sizeof(_value), cacheMetadata);
    }

    return true;
  }

  /**
   *
   * @return {Promise}
   */
  async size() {
    return this._map.size();
  }
}
