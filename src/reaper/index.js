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
  _getExpiredMetaData() {
    return this._map.metaData.filter((entry) => {
      if (!get(entry, ['cacheability', 'ttl'], null)) return false;
      return entry.cacheability.ttl < Date.now();
    });
  }

  /**
   *
   * @param {Array<Object>} metaData
   * @return {Promise}
   */
  async cull(metaData) {
    if (!metaData.length) return;

    metaData.forEach(({ key }) => {
      this._map.delete(key);
    });
  }

  /**
   *
   * @return {void}
   */
  start() {
    this._intervalID = setInterval(() => {
      this.cull(this._getExpiredMetaData());
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
