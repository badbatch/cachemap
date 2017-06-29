import redis from 'redis';
import logger from '../logger';

/**
 *
 * The cachemap redis proxy
 */
export default class RedisProxy {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {void|Object}
   */
  constructor({ name = 'redis client', options = {} } = {}) {
    this._client = options.mock ? options.mock() : redis.createClient(options);

    this._client.on('connect', () => {
      logger.info(`${name} connected`);
    });

    this._client.on('error', (err) => {
      logger.error(`${name} error: ${err}`);
    });

    this._client.on('warning', (warn) => {
      logger.warn(`${name} warning: ${warn}`);
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
