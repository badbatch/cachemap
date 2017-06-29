/**
 *
 * The cachemap local storage proxy
 */
export default class LocalProxy {
  /**
   *
   * @constructor
   * @param {Object} config
   * @return {void|Object}
   */
  constructor({ mock }) {
    this._map = mock ? mock() : localStorage;
  }

  /**
   *
   * @return {Promise}
   */
  clear() {
    return new Promise((resolve) => {
      resolve(this._map.clear());
    });
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  delete(key) {
    return new Promise((resolve) => {
      resolve(this._map.removeItem(key));
    });
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  get(key) {
    return new Promise((resolve) => {
      resolve(this._map.getItem(key) || null);
    });
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  has(key) {
    return new Promise((resolve) => {
      resolve(this._map.getItem(key) !== undefined);
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
      resolve(!!this._map.setItem(key, value));
    });
  }

  /**
   *
   * @return {Promise}
   */
  size() {
    return new Promise((resolve) => {
      resolve(this._map.length);
    });
  }
}
