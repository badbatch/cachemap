import registerPromiseWorker from "promise-worker/register";
import DefaultCachemap from "./cachemap";
import { Metadata, PostMessageArgs, PostMessageResult } from "./types";

let cachemap: DefaultCachemap;

function getMetadata({ metadata, usedHeapSize }: DefaultCachemap): { metadata: Metadata[], usedHeapSize: number } {
  return { metadata, usedHeapSize };
}

registerPromiseWorker(async (message: PostMessageArgs): Promise<PostMessageResult> => {
  const { args, key, opts, type, value } = message;

  if (type === "create" && args) {
    cachemap = await DefaultCachemap.create(args);
    return getMetadata(cachemap);
  }

  let result: any;

  switch (message.type) {
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

  return { result, ...getMetadata(cachemap) };
});
