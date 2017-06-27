/**
 *
 * The six map proxy
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
      resolve(this._map.delete(key));
    });
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  get(key) {
    return new Promise((resolve) => {
      resolve(this._map.get(key) || null);
    });
  }

  /**
   *
   * @param {string} key
   * @return {Promise}
   */
  has(key) {
    return new Promise((resolve) => {
      resolve(this._map.has(key));
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
      resolve(!!this._map.set(key, value));
    });
  }

  /**
   *
   * @return {Promise}
   */
  size() {
    return new Promise((resolve) => {
      resolve(this._map.size);
    });
  }
}
