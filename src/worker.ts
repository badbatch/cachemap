import registerPromiseWorker from "promise-worker/register";
import { DefaultCachemap } from "./default-cachemap";
import { Metadata, PostMessageArgs, PostMessageResult, StoreProxyTypes } from "./types";

let sinon: any;

if (process.env.TEST_ENV) {
  sinon = require("sinon");
}

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

  let stub: sinon.SinonStub | undefined;

  if (sinon && opts && opts.stub) {
    const { get } = require("lodash");
    const storeClient: StoreProxyTypes = get(cachemap, ["_store"]);
    const error = new Error("Oops, there seems to be a problem");
    stub = sinon.stub(storeClient, "set").rejects(error);
  }

  let result: any;

  try {
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
  } catch (error) {
    if (stub) stub.restore();
    return Promise.reject(error);
  }

  return { result, ...getMetadata(cachemap) };
});
