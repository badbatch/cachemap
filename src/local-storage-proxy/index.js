/**
 *
 * The cachemap local storage proxy
 */
export default class LocalProxy {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {void}
   */
  constructor({ mock }) {
    this._storage = mock ? mock() : localStorage;
  }

  /**
   *
   * @return {Promise}
   */
  async clear() {
    const output = await new Promise((resolve) => {
      resolve(this._storage.clear());
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
      resolve(this._storage.removeItem(key));
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
      resolve(this._storage.getItem(key) || null);
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
      resolve(this._storage.getItem(key) !== undefined);
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
      resolve(!!this._storage.setItem(key, value));
    });

    return output;
  }

  /**
   *
   * @return {Promise}
   */
  async size() {
    const output = await new Promise((resolve) => {
      resolve(this._storage.length);
    });

    return output;
  }
}
