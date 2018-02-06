import registerPromiseWorker from "promise-worker/register";
import { DefaultCachemap } from "./default-cachemap";
import convertCacheability from "./helpers/convert-cacheability";
import { Metadata, PostMessageArgs, PostMessageResult } from "./types";

let cachemap: DefaultCachemap;

function getMetadata({
  metadata,
  storeType,
  usedHeapSize,
}: DefaultCachemap): { metadata: Metadata[], storeType: string, usedHeapSize: number } {
  return { metadata, storeType, usedHeapSize };
}

function requiresKey(type: string): boolean {
  return type === "delete" || type === "get" || type === "has" || type === "set";
}

registerPromiseWorker(async (message: PostMessageArgs): Promise<PostMessageResult> => {
  const { args, exported, key, keys, opts, type, value } = message;

  if (type === "create" && args) {
    try {
      cachemap = await DefaultCachemap.create({ ...args, _inWorker: true });
      return getMetadata(cachemap);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  if (requiresKey(type) && !key) {
    return Promise.reject(new TypeError("Worker expected key to have a length greather than 0."));
  }

  let result: any;

  try {
    switch (type) {
      case "clear":
        await cachemap.clear();
        break;
      case "delete":
        if (key) result = await cachemap.delete(key, opts);
        break;
      case "entries":
        result = await cachemap.entries(keys);
        break;
      case "export":
        result = await cachemap.export(opts);
        break;
      case "get":
        if (key) result = await cachemap.get(key, opts);
        break;
      case "has":
        if (key) result = await cachemap.has(key, opts);
        break;
      case "import":
        if (exported) {
          await cachemap.import({
            entries: exported.entries,
            metadata: convertCacheability(exported.metadata),
          });
        }
        break;
      case "set":
        if (key) await cachemap.set(key, value, opts);
        break;
      case "size":
        result = await cachemap.size();
        break;
      default:
        // no default
    }
  } catch (error) {
    return Promise.reject(error);
  }

  return { result, ...getMetadata(cachemap) };
});
