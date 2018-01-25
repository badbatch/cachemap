import registerPromiseWorker from "promise-worker/register";
import { DefaultCachemap } from "./default-cachemap";
import { Metadata, PostMessageArgs, PostMessageResult } from "./types";

let cachemap: DefaultCachemap;

function getMetadata({
  metadata,
  storeType,
  usedHeapSize,
}: DefaultCachemap): { metadata: Metadata[], storeType: string, usedHeapSize: number } {
  return { metadata, storeType, usedHeapSize };
}

registerPromiseWorker(async (message: PostMessageArgs): Promise<PostMessageResult> => {
  const { args, key, opts, type, value } = message;

  if (type === "create" && args) {
    cachemap = await DefaultCachemap.create({ ...args, _inWorker: true });
    return getMetadata(cachemap);
  }

  if (type !== "clear" && type !== "size" && !key) {
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
      case "get":
        if (key) result = await cachemap.get(key, opts);
        break;
      case "has":
        if (key) result = await cachemap.has(key, opts);
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
