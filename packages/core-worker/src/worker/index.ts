import Core, { coreDefs } from "@cachemap/core";
import indexedDB from "@cachemap/indexed-db";
import reaper from "@cachemap/reaper";
import { isString } from "lodash";
import registerPromiseWorker from "promise-worker/register";
import { CLEAR, CREATE, DELETE, ENTRIES, EXPORT, GET, HAS, IMPORT, SET, SIZE } from "../constants";
import { CommonOptions, CreateOptions, PostMessage, PostMessageResult } from "../defs";

let cachemap: Core;

function filterProps({ metadata, usedHeapSize }: Core): { metadata: coreDefs.Metadata[], usedHeapSize: number } {
  return { metadata, usedHeapSize };
}

function requiresKey(type: string): boolean {
  return type === DELETE || type === GET || type === HAS || type === SET;
}

registerPromiseWorker(async (message: PostMessage): Promise<PostMessageResult> => {
  const { key, keys, options, type, value } = message;

  if (type === CREATE && options) {
    try {
      const { maxHeapSize, reaperOptions, ...otherOptions } = options as CreateOptions;

      cachemap = await Core.init({
        ...otherOptions,
        reaper: reaper(reaperOptions),
        store: indexedDB({ maxHeapSize }),
      });
      return filterProps(cachemap);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  if (requiresKey(type) && !isString(key)) {
    return Promise.reject(new TypeError("@cachemap/obrero expected key to be an string."));
  }

  let result: any;

  try {
    switch (type) {
      case CLEAR:
        await cachemap.clear();
        break;
      case DELETE:
        if (key) result = await cachemap.delete(key, options as CommonOptions);
        break;
      case ENTRIES:
        result = await cachemap.entries(keys);
        break;
      case EXPORT:
        result = await cachemap.export(options as coreDefs.ExportOptions);
        break;
      case GET:
        if (key) result = await cachemap.get(key, options as CommonOptions);
        break;
      case HAS:
        if (key) result = await cachemap.has(key, options as CommonOptions);
        break;
      case IMPORT:
        if (options) await cachemap.import(options as coreDefs.ImportOptions);
        break;
      case SET:
        if (key) await cachemap.set(key, value, options as CommonOptions);
        break;
      case SIZE:
        result = await cachemap.size();
        break;
      default:
        // no default
    }
  } catch (error) {
    return Promise.reject(error);
  }

  return { result, ...filterProps(cachemap) };
});
