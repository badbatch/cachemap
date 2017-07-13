/**
 *
 * @param {Object} cacheability
 * @return {boolean}
 */
export const checkCacheability = function checkCacheability({ ttl } = {}) {
  return !ttl ? true : Date.now() < ttl;
};

/**
 *
 * @param {string} cacheControl
 * @return {Array<string>}
 */
export const getDirectives = function getDirectives(cacheControl = '') {
  return cacheControl.split(', ');
};

/**
 *
 * @param {string} cacheControl
 * @return {boolean}
 */
export const hasNoStore = function hasNoStore(cacheControl = '') {
  if (!cacheControl) return false;
  return !!getDirectives(cacheControl).find(value => value === 'no-store');
};

/**
 *
 * @param {string} cacheControl
 * @return {boolean}
 */
const hasNoCache = function hasNoCache(cacheControl = '') {
  if (!cacheControl) return false;
  return !!getDirectives(cacheControl).find(value => value === 'no-cache');
};

/**
 *
 * @param {string} cacheControl
 * @return {number}
 */
export const setTTL = function setTTL(cacheControl = '') {
  if (!cacheControl) return null;
  let maxAge = getDirectives(cacheControl).find(value => !!value.match(/^s-maxage.*$/));
  if (!maxAge) maxAge = getDirectives(cacheControl).find(value => !!value.match(/^max-age.*$/));
  if (!maxAge) return null;
  const ms = Number(maxAge.match(/\d+$/)[0] * 1000);
  return Date.now() + ms;
};

/**
 *
 * @param {string} cacheControl
 * @return {number|null}
 */
export const setCacheability = function setCacheability(cacheControl = '') {
  return {
    cacheControl,
    noCache: hasNoCache(cacheControl),
    ttl: setTTL(cacheControl),
  };
};
