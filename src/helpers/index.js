import { camelCase, cloneDeep, isBoolean, kebabCase } from 'lodash';

/**
 *
 * @param {Object} metadata
 * @param {numbert} metadata.ttl
 * @return {boolean}
 */
export const checkCacheability = function checkCacheability({ ttl } = {}) {
  return !ttl ? true : ttl > Date.now();
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
 * @param {Object} cacheMetadata
 * @param {number} cacheMetadata.maxAge
 * @param {number} cacheMetadata.sMaxage
 * @return {number}
 */
export const setTTL = function setTTL({ maxAge, sMaxage }) {
  const sec = sMaxage || maxAge;
  if (!sec) return null;
  const ms = sec * 1000;
  return Date.now() + ms;
};

/**
 *
 * @param {Object} metadata
 * @return {string}
 */
export const printCacheControl = function printCacheControl(metadata) {
  const _metadata = cloneDeep(metadata);
  if (_metadata.sMaxage) _metadata.sMaxage = Math.round((_metadata.ttl - Date.now()) / 1000);
  if (_metadata.maxAge) _metadata.maxAge = Math.round((_metadata.ttl - Date.now()) / 1000);
  const directives = [];

  Object.keys(_metadata).forEach((key) => {
    if (key === 'check' || key === 'etag' || key === 'printCacheControl' || key === 'ttl') return;

    if (isBoolean(_metadata[key])) {
      directives.push(kebabCase(key));
      return;
    }

    directives.push(`${kebabCase(key)}=${_metadata[key]}`);
  });

  return directives.join(', ');
};

/**
 *
 * @param {Object} cacheHeaders
 * @param {string} cacheHeaders.cacheControl
 * @param {string} cacheHeaders.etag
 * @return {Object}
 */
export const parseCacheHeaders = function parseCacheHeaders({ cacheControl = '', etag = null } = {}) {
  if (!cacheControl) return {};
  const directives = getDirectives(cacheControl);
  const metadata = { etag };

  directives.forEach((dir) => {
    if (dir.match(/=/)) {
      const [key, value] = dir.split('=');
      metadata[camelCase(key)] = Number(value);
      return;
    }

    metadata[camelCase(dir)] = true;
  });

  metadata.ttl = setTTL(metadata);
  metadata.printCacheControl = () => printCacheControl(metadata);
  metadata.check = () => checkCacheability(metadata);
  return metadata;
};
