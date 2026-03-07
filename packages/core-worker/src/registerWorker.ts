import { type Core } from '@cachemap/core';
import { constants } from '@cachemap/utils';
import {
  type EnrichedPostMessage,
  type MetadataAndUsedHeapSize,
  type PostMessageResultMap,
  type RegisterWorkerOptions,
} from './types.ts';

const getMetadataAndUsedHeapSize = ({ backupStoreType, metadata, usedHeapSize }: Core): MetadataAndUsedHeapSize => {
  return { backupStoreType, metadata, usedHeapSize };
};

const isCachemapPostMessageRequest = (data: unknown): data is EnrichedPostMessage => {
  return typeof data === 'object' && !!data && 'type' in data && 'method' in data && data.type === constants.CACHEMAP;
};

export const handleMessage = async (message: EnrichedPostMessage, cachemap: Core): Promise<void> => {
  let result: PostMessageResultMap<unknown>[typeof message.method];

  try {
    switch (message.method) {
      case constants.CLEAR: {
        cachemap.clear();
        break;
      }

      case constants.CONTROLLER: {
        switch (message.cmd) {
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
        }

        break;
      }

      case constants.DELETE: {
        const deleted = cachemap.delete(message.key, message.options);
        const metadata = cachemap.getMetadataEntry(message.key);

        result = {
          deleted,
          key: message.key,
          tags: metadata?.tags,
        };

        break;
      }

      case constants.ENTRIES: {
        result = cachemap.entries(message.keys, message.options);
        break;
      }

      case constants.EXISTS: {
        result = await cachemap.exists(message.key, message.options);
        break;
      }

      case constants.EXPORT: {
        result = await cachemap.export(message.options);
        break;
      }

      case constants.FETCH: {
        result = await cachemap.fetch(message.key, message.options);
        break;
      }

      case constants.FETCH_ENTRIES: {
        result = await cachemap.fetchEntries(message.keys, message.options);
        break;
      }

      case constants.FLUSH: {
        await cachemap.flush();
        break;
      }

      case constants.GET: {
        result = cachemap.get(message.key, message.options);
        break;
      }

      case constants.HAS: {
        result = cachemap.has(message.key, message.options);
        break;
      }

      case constants.IMPORT: {
        await cachemap.import(message.options);
        break;
      }

      case constants.REMOVE: {
        result = await cachemap.remove(message.key, message.options);
        break;
      }

      case constants.SET: {
        cachemap.set(message.key, message.value, message.options);
        break;
      }

      case constants.SIZE: {
        result = cachemap.size;
        break;
      }

      case constants.WRITE: {
        await cachemap.write(message.key, message.value, message.options);
        break;
      }

      default:
      // no default
    }
  } catch (error) {
    self.postMessage({ errors: error, messageId: message.messageId });
  }

  self.postMessage({
    messageId: message.messageId,
    method: message.method,
    result,
    type: message.type,
    ...getMetadataAndUsedHeapSize(cachemap),
  });
};

export const registerWorker = ({ cachemap }: RegisterWorkerOptions): void => {
  const onMessage = ({ data }: MessageEvent<unknown>): void => {
    if (!isCachemapPostMessageRequest(data)) {
      return;
    }

    void handleMessage(data, cachemap);
  };

  self.addEventListener(constants.MESSAGE, onMessage);

  cachemap.emitter.on(
    constants.ENTRY_DELETED,
    ({ deleted, key, tags }: { deleted: boolean; key: string; tags?: string[] }) => {
      self.postMessage({
        method: constants.ENTRY_DELETED,
        result: { deleted, key, tags },
        type: constants.CACHEMAP,
      });
    },
  );
};
