import { get } from 'lodash';
import md5 from 'md5';
import sizeof from 'object-sizeof';
import { checkCacheability, hasNoStore, setCacheability } from '../helpers/caching';
import logger from '../../utils/logger';

/**
 *
 * The six enhanced map
 */
export default class Dmap {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {void}
   */
  constructor({ desc, disableCacheInvalidation, options, storageType = 'redis' } = {}) {
    this._desc = desc;
    this._disableCacheInvalidation = disableCacheInvalidation;

    if (storageType === 'redis') {
      const RedisProxy = require('../redis-proxy').default; // eslint-disable-line global-require
      this._map = new RedisProxy({ desc, options });

      this._metaDataStorage = new RedisProxy({
        desc: `${desc} metadata`,
        options: Object.assign(options, { db: options.db + 1 }),
      });
    } else if (storageType === 'localStorage') {
      const LocalProxy = require('../local-storage-proxy').default; // eslint-disable-line global-require
      this._map = new LocalProxy();
      this._metaDataStorage = new LocalProxy();
    } else if (storageType === 'map') {
      const MapProxy = require('../map-proxy').default; // eslint-disable-line global-require
      this._map = new MapProxy();
      this._metaDataStorage = new MapProxy();
    }

    this._storageType = storageType;
    this._usedHeapSize = 0;
    this._getStoredMetaData();
  }

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
   * @param {Object} headers
   * @return {void}
   */
  _addMetaData(key, size, headers) {
    this._metaData.push({
      accessedCount: 0,
      added: Date.now(),
      key,
      lastAccessed: null,
      lastUpdated: null,
      size,
      cacheability: setCacheability(headers),
    });

    this._sortMetaData();
    this._updateHeapSize();
    this._storeMetaData();
  }

  /**
   *
   * @private
   * @param {string} key
   * @return {boolean}
   */
  _checkMetaData(key) {
    if (this.disableCacheInvalidation) {
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
  _compare(a, b) {
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

    this._metaData = metaData ? JSON.parse(metaData) : [];
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
    this._metaData.sort(this._compare);
  }

  /**
   *
   * @private
   * @return {number}
   */
  _updateHeapSize() {
    this._usedHeapSize = this._metaData.reduce((acc, value) => (acc + value.size), 0);
  }

  /**
   *
   * @private
   * @param {string} key
   * @param {number} [size]
   * @param {Object} [headers]
   * @return {void}
   */
  _updateMetaData(key, size, headers) {
    const entry = this._getMetaDataValue(key);

    if (size) {
      entry.size = size;
      entry.lastUpdated = Date.now();
    } else {
      entry.accessedCount += 1;
      entry.lastAccessed = Date.now();
    }

    if (headers) {
      entry.cacheability = setCacheability(headers);
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
  getTimeToExpire(key) {
    const entry = this._getMetaDataValue(key);
    const validUntil = get(entry, ['cacheability', 'validUntil'], null);

    if (!validUntil) {
      return null;
    }

    return Math.round((validUntil - Date.now()) / 1000);
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
  async set(key, value, { hash = false, headers, stringify = true } = {}) {
    if (hash) {
      key = this.hash(key);
    }

    if (hasNoStore(headers)) {
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
      this._updateMetaData(key, sizeof(value), headers);
    } else {
      this._addMetaData(key, sizeof(value), headers);
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
