import { get } from 'lodash';

/**
 *
 * The six reaper
 */
export default class Reaper {
  /**
   *
   * @constructor
   * @param {Array<Dmap>} dmaps
   * @param {Object} options
   * @return {void}
   */
  constructor(dmaps = [], { interval = 60000, start = true } = {}) {
    this._dmaps = dmaps;
    this._interval = interval;

    if (start) {
      this.start();
    }
  }

  /**
   *
   * @param {Dmap} dmap
   * @return {Promise}
   */
  async _cull(dmap) {
    const metaData = this._getExpiredMetaData(dmap);

    if (!metaData.length) {
      return;
    }

    metaData.forEach(({ key }) => {
      dmap.delete(key);
    });
  }

  /**
   *
   * @param {Dmap} dmap
   * @return {Array<Object>}
   */
  _getExpiredMetaData(dmap) {
    return dmap.metaData.filter((entry) => {
      if (!get(entry, ['cacheability', 'validUntil'], null)) {
        return false;
      }

      return entry.cacheability.validUntil < Date.now();
    });
  }

  /**
   *
   * @return {void}
   */
  start() {
    if (!this._dmaps.length) {
      return;
    }

    this._intervalID = setInterval(() => {
      this._dmaps.forEach((dmap) => {
        this._cull(dmap);
      });
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
