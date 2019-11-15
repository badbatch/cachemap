import Core, { ExportOptions, ImportOptions } from "@cachemap/core";
import { isPlainObject, isString } from "lodash";
import { CACHEMAP, CLEAR, DELETE, ENTRIES, EXPORT, GET, HAS, IMPORT, MESSAGE, SET, SIZE } from "../constants";
import { CommonOptions, FilterPropsResult, PostMessage, RegisterWorkerOptions } from "../types";

const { addEventListener, postMessage } = (self as unknown) as DedicatedWorkerGlobalScope;

function requiresKey(type: string): boolean {
  return type === DELETE || type === GET || type === HAS || type === SET;
}

function filterProps({ metadata, storeType, usedHeapSize }: Core): FilterPropsResult {
  return { metadata, storeType, usedHeapSize };
}

export async function handleMessage(message: PostMessage, cachemap: Core): Promise<void> {
  const { key, keys, messageID, method, options, type, value } = message;

  if (requiresKey(method) && !isString(key)) {
    return Promise.reject(new TypeError("@cachemap/core-worker expected key to be an string."));
  }

  let result: any;

  try {
    switch (method) {
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
        result = await cachemap.export(options as ExportOptions);
        break;
      case GET:
        if (key) result = await cachemap.get(key, options as CommonOptions);
        break;
      case HAS:
        if (key) result = await cachemap.has(key, options as CommonOptions);
        break;
      case IMPORT:
        if (options) await cachemap.import(options as ImportOptions);
        break;
      case SET:
        if (key) await cachemap.set(key, value, options as CommonOptions);
        break;
      case SIZE:
        result = await cachemap.size();
        break;
      // no default
    }
  } catch (errors) {
    postMessage({ errors, messageID });
  }

  postMessage({ messageID, result, type, ...filterProps(cachemap) });
}

export default async function registerWorker({ cachemap }: RegisterWorkerOptions): Promise<void> {
  function onMessage({ data }: MessageEvent): void {
    if (!isPlainObject(data)) return;

    const { type } = data as PostMessage;
    if (type !== CACHEMAP) return;

    handleMessage(data, cachemap);
  }

  addEventListener(MESSAGE, onMessage);
}
