import { isFunction } from 'lodash';
import redis from 'redis';
import logger from '../../utils/logger';

/**
 *
 * The six redis proxy
 */
export default class RedisProxy {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {void}
   */
  constructor({ desc = 'redis client', onConnect, options = {} } = {}) {
    this._client = redis.createClient(options);
    const _this = this;

    this._client.on('connect', () => {
      logger.info(`${desc} connected`);

      if (isFunction(onConnect)) {
        onConnect(_this);
      }
    });

    this._client.on('error', (err) => {
      logger.error(`${desc} error: ${err}`);
    });

    this._client.on('warning', (warn) => {
      logger.warn(`${desc} warning: ${warn}`);
    });
  }

  /**
   *
   * @return {Promise}
   */
  clear() {
    return new Promise((resolve) => {
      this._client.flushdb((err, reply) => {
        resolve(!!reply);
      });
    });
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  delete(key) {
    return new Promise((resolve) => {
      this._client.del(key, (err, reply) => {
        resolve(!!reply);
      });
    });
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  get(key) {
    return new Promise((resolve) => {
      this._client.get(key, (err, reply) => {
        resolve(reply || null);
      });
    });
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  has(key) {
    return new Promise((resolve) => {
      this._client.exists(key, (err, reply) => {
        resolve(!!reply);
      });
    });
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   * @return {Promise}
   */
  set(key, value) {
    return new Promise((resolve) => {
      this._client.set(key, value, (err, reply) => {
        resolve(!!reply);
      });
    });
  }

  /**
   *
   * @return {Promise}
   */
  size() {
    return new Promise((resolve) => {
      this._client.dbsize((err, reply) => {
        resolve(reply);
      });
    });
  }
}
