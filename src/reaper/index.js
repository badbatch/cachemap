import { get } from 'lodash';

/**
 *
 * The cachemap reaper
 */
export default class Reaper {
  /**
   *
   * @constructor
   * @param {Object} map
   * @param {Object} options
   * @return {void}
   */
  constructor(map, { interval = 60000, start = true } = {}) {
    this._map = map;
    this._interval = interval;
    if (start) this.start();
  }

  /**
   *
   * @private
   * @type {number}
   */
  _intervalID;

  /**
   *
   * @private
   * @return {Array<Object>}
   */
  _getExpiredMetadata() {
    return this._map.metadata.filter((entry) => {
      if (!get(entry, ['cacheability', 'ttl'], null)) return false;
      return !entry.cacheability.check();
    });
  }

  /**
   *
   * @param {Array<Object>} metadata
   * @return {Promise}
   */
  async cull(metadata) {
    if (!metadata.length) return;

    metadata.forEach(({ key }) => {
      this._map.delete(key);
    });
  }

  /**
   *
   * @return {void}
   */
  start() {
    this._intervalID = setInterval(() => {
      this.cull(this._getExpiredMetadata());
    }, this._interval);
  }

  /**
   *
   * @return {void}
   */
  stop() {
    clearInterval(this._intervalID);
  }
}
