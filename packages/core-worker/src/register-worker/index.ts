import { type Core, type ExportOptions, type ImportOptions } from '@cachemap/core';
import { constants } from '@cachemap/utils';
import isPlainObject from 'lodash/isPlainObject.js';
import isString from 'lodash/isString.js';
import { type CommonOptions, type FilterPropsResult, type PostMessage, type RegisterWorkerOptions } from '../types.ts';

function requiresKey(type: string): boolean {
  return type === constants.DELETE || type === constants.GET || type === constants.HAS || type === constants.SET;
}

function filterProps({ metadata, storeType, usedHeapSize }: Core): FilterPropsResult {
  return { metadata, storeType, usedHeapSize };
}

export async function handleMessage(message: PostMessage, cachemap: Core): Promise<void> {
  const { key, keys, messageID, method, options, type, value } = message;

  if (requiresKey(method) && !isString(key)) {
    throw new TypeError('@cachemap/core-worker expected key to be an string.');
  }

  let result: unknown;

  try {
    switch (method) {
      case constants.CLEAR: {
        await cachemap.clear();
        break;
      }

      case constants.DELETE: {
        if (key) {
          result = await cachemap.delete(key, options as CommonOptions);
        }

        break;
      }

      case constants.ENTRIES: {
        result = await cachemap.entries(keys);
        break;
      }

      case constants.EXPORT: {
        result = await cachemap.export(options as ExportOptions);
        break;
      }

      case constants.GET: {
        if (key) {
          result = await cachemap.get(key, options as CommonOptions);
        }

        break;
      }

      case constants.HAS: {
        if (key) {
          result = await cachemap.has(key, options as CommonOptions);
        }

        break;
      }

      case constants.IMPORT: {
        if (options) {
          await cachemap.import(options as ImportOptions);
        }

        break;
      }

      case constants.SET: {
        if (key) {
          await cachemap.set(key, value, options as CommonOptions);
        }

        break;
      }

      case constants.SIZE: {
        result = await cachemap.size();
        break;
      }

      case constants.START_REAPER: {
        cachemap.reaper?.start();
        break;
      }

      case constants.STOP_REAPER: {
        cachemap.reaper?.stop();
        break;
      }

      case constants.START_BACKUP: {
        cachemap.startBackup();
        break;
      }

      case constants.STOP_BACKUP: {
        cachemap.stopBackup();
        break;
      }
      // no default
    }
  } catch (error) {
    self.postMessage({ errors: error, messageID });
  }

  self.postMessage({ messageID, method, result, type, ...filterProps(cachemap) });
}

export function registerWorker({ cachemap }: RegisterWorkerOptions): void {
  function onMessage({ data }: MessageEvent<PostMessage>): void {
    if (!isPlainObject(data)) {
      return;
    }

    const { type } = data;

    if (type !== constants.CACHEMAP) {
      return;
    }

    void handleMessage(data, cachemap);
  }

  self.addEventListener(constants.MESSAGE, onMessage);

  cachemap.emitter.on(cachemap.events.ENTRY_DELETED, ({ deleted, key }: { deleted: boolean; key: string }) => {
    self.postMessage({ deleted, key, method: cachemap.events.ENTRY_DELETED, type: constants.CACHEMAP });
  });
}
