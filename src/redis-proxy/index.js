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
   * @return {void}
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
  async clear() {
    const output = await new Promise((resolve) => {
      this._client.flushdb((err, reply) => {
        resolve(!!reply);
      });
    });

    return output;
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  async delete(key) {
    const output = await new Promise((resolve) => {
      this._client.del(key, (err, reply) => {
        resolve(!!reply);
      });
    });
    return output;
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  async get(key) {
    const output = await new Promise((resolve) => {
      this._client.get(key, (err, reply) => {
        resolve(reply || null);
      });
    });

    return output;
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  async has(key) {
    const output = await new Promise((resolve) => {
      this._client.exists(key, (err, reply) => {
        resolve(!!reply);
      });
    });

    return output;
  }

  /**
   *
   * @param {string} key
   * @param {string} value
   * @return {Promise}
   */
  async set(key, value) {
    const output = await new Promise((resolve) => {
      this._client.set(key, value, (err, reply) => {
        resolve(!!reply);
      });
    });

    return output;
  }

  /**
   *
   * @return {Promise}
   */
  async size() {
    const output = await new Promise((resolve) => {
      this._client.dbsize((err, reply) => {
        resolve(reply);
      });
    });

    return output;
  }
}
