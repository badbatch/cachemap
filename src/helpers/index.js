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
 * @return {Array<string>}
 */
export const getCacheabilityDirs = function getCacheabilityDirs(cacheControl = '') {
  const directives = getDirectives(cacheControl);

  return directives.filter((value) => {
    let cacheable = false;

    switch (value) {
      case 'public':
        cacheable = true;
        break;
      case 'private':
        cacheable = true;
        break;
      case 'no-cache':
        cacheable = true;
        break;
      default:
        // No default
    }

    return cacheable;
  });
};

/**
 *
 * @param {string} cacheControl
 * @return {Array<string>}
 */
export const getExpirationDirs = function getExpirationDirs(cacheControl = '') {
  const directives = getDirectives(cacheControl);

  return directives.filter((value) => {
    let cacheable = false;
    const match = value.match(/[^=]*/);

    if (!match) {
      return cacheable;
    }

    switch (match[0]) {
      case 'max-age':
        cacheable = true;
        break;
      case 's-maxage':
        cacheable = true;
        break;
      default:
        // No default
    }

    return cacheable;
  });
};

/**
 *
 * @param {string} cacheControl
 * @return {Array<string>}
 */
export const getRevalidationDirs = function getRevalidationDirs(cacheControl = '') {
  const directives = getDirectives(cacheControl);
  return directives.filter(value => value === 'must-revalidate');
};

/**
 *
 * @param {string} cacheControl
 * @return {boolean}
 */
export const hasNoStore = function hasNoStore(cacheControl = '') {
  if (!cacheControl) {
    return false;
  }

  return !!getDirectives(cacheControl).find(value => value === 'no-store');
};

/**
 *
 * @param {string} cacheControl
 * @return {boolean}
 */
const hasNoCache = function hasNoCache(cacheControl = '') {
  if (!cacheControl) {
    return false;
  }

  return !!getDirectives(cacheControl).find(value => value === 'no-cache');
};

/**
 *
 * @param {string} cacheControl
 * @return {number}
 */
export const setTTL = function setTTL(cacheControl = '') {
  if (!cacheControl) {
    return null;
  }

  let maxAge = getDirectives(cacheControl).find(value => !!value.match(/^s-maxage.*$/));

  if (!maxAge) {
    maxAge = getDirectives(cacheControl).find(value => !!value.match(/^max-age.*$/));
  }

  if (!maxAge) {
    return null;
  }

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
