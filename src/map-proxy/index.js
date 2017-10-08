/**
 *
 * The cachemap map proxy
 */
export default class MapProxy {
  /**
   *
   * @constructor
   * @return {void}
   */
  constructor() {
    this._map = new Map();
  }

  /**
   *
   * @return {Promise}
   */
  async clear() {
    const output = await new Promise((resolve) => {
      resolve(this._map.clear());
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
      resolve(this._map.delete(key));
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
      resolve(this._map.get(key) || null);
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
      resolve(this._map.has(key));
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
      resolve(!!this._map.set(key, value));
    });

    return output;
  }

  /**
   *
   * @return {Promise}
   */
  async size() {
    const output = await new Promise((resolve) => {
      resolve(this._map.size);
    });

    return output;
  }
}
