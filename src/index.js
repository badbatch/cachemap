import { isFunction, get } from 'lodash';
import md5 from 'md5';
import sizeof from 'object-sizeof';
import { checkCacheability, hasNoStore, setCacheability } from './helpers';
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
    if (isFunction(comparator)) {
      this._comparator = comparator;
    }

    this._disableCacheInvalidation = disableCacheInvalidation;

    if (process.env.WEB_ENV) {
      const LocalStorageProxy = require('./local-storage-proxy').default; // eslint-disable-line global-require
      this._map = new LocalStorageProxy(localStorageOptions);
      const { maxHeapSize } = localStorageOptions;
      this._maxHeapSize = maxHeapSize || 4194304;
      this._metaDataStorage = new LocalStorageProxy(localStorageOptions);
    } else {
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
   * @param {string} cacheControl
   * @return {void}
   */
  _addMetaData(key, size, cacheControl) {
    this._metaData.push({
      accessedCount: 0,
      added: Date.now(),
      key,
      lastAccessed: null,
      lastUpdated: null,
      size,
      cacheability: setCacheability(cacheControl),
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
    if (this._usedHeapSize > this._maxHeapSize) {
      this._reduceHeapSize();
    }
  }

  /**
   *
   * @private
   * @param {string} key
   * @return {boolean}
   */
  _checkMetaData(key) {
    if (this._disableCacheInvalidation) {
      return true;
    }

    const { cacheability } = this._getMetaDataValue(key);
    return checkCacheability(cacheability);
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
      metaData = await this._metaDataStorage.get(`${this._desc} metaData`);
    } catch (err) {
      logger.error(err);
    }

    if (metaData) {
      this._metaData = JSON.parse(metaData);
    }
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
    this._metaDataStorage.set(`${this._desc} metaData`, JSON.stringify(this._metaData));
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

    if (this._maxHeapSize) {
      this._checkHeapThreshold();
    }
  }

  /**
   *
   * @private
   * @param {string} key
   * @param {number} [size]
   * @param {string} [cacheControl]
   * @return {void}
   */
  _updateMetaData(key, size, cacheControl) {
    const entry = this._getMetaDataValue(key);

    if (size) {
      entry.size = size;
      entry.lastUpdated = Date.now();
    } else {
      entry.accessedCount += 1;
      entry.lastAccessed = Date.now();
    }

    if (cacheControl) {
      entry.cacheability = setCacheability(cacheControl);
    }

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
    if (hash) {
      key = this.hash(key);
    }

    let hasDel;

    try {
      hasDel = await this._map.delete(key);
    } catch (err) {
      logger.error(err);
    }

    if (!hasDel) {
      return false;
    }

    this._deleteMetaData(key);
    return true;
  }

  /**
   *
   * @param {any} key
   * @param {Object} [opts]
   * @return {Promise}
   */
  async get(key, { hash = false, parse = true } = {}) {
    if (hash) {
      key = this.hash(key);
    }

    let value;

    try {
      value = await this._map.get(key);
    } catch (err) {
      logger.error(err);
    }

    if (!value) {
      return null;
    }

    this._updateMetaData(key);

    if (parse) {
      value = JSON.parse(value);
    }

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
   * @param {string} key
   * @return {number}
   */
  getTTL(key) {
    const entry = this._getMetaDataValue(key);
    const ttl = get(entry, ['cacheability', 'ttl'], null);

    if (!ttl) {
      return null;
    }

    return Math.round((ttl - Date.now()) / 1000);
  }

  /**
   *
   * @param {any} key
   * @param {Object} [opts]
   * @return {Promise}
   */
  async has(key, { checkMeta = true, hash = false } = {}) {
    if (hash) {
      key = this.hash(key);
    }

    let hasKey;

    try {
      hasKey = await this._map.has(key);
    } catch (err) {
      logger.error(err);
    }

    if (!hasKey) {
      return false;
    }

    if (checkMeta && !this._checkMetaData(key)) {
      await this.delete(key);
      return false;
    }

    return true;
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
   * @return {Promise}
   */
  async set(key, value, { cacheControl, hash = false, stringify = true } = {}) {
    if (hash) {
      key = this.hash(key);
    }

    if (hasNoStore(cacheControl)) {
      return false;
    }

    if (stringify) {
      value = JSON.stringify(value);
    }

    let hasKey, setValue;

    try {
      hasKey = await this._map.has(key);
      setValue = await this._map.set(key, value);
    } catch (err) {
      logger.error(err);
    }

    if (!setValue) {
      return false;
    }

    if (hasKey) {
      this._updateMetaData(key, sizeof(value), cacheControl);
    } else {
      this._addMetaData(key, sizeof(value), cacheControl);
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
