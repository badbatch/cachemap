import { isPlainObject } from "lodash";
import Cachemap from "./cachemap";
import { CachemapArgs } from "./types";
import WorkerCachemap from "./worker-cachemap";

declare global {
  interface Window {
      Worker: Worker;
  }
}

export default async function createCachemap(args: CachemapArgs): Promise<Cachemap | WorkerCachemap> {
  if (!isPlainObject(args)) {
    throw new TypeError("createCachemap expected args to ba a plain object.");
  }

  let cachemap: Cachemap | WorkerCachemap;

  if (process.env.WEB_ENV) {
    const { use = {} } = args;

    if (!isPlainObject(use)) {
      throw new TypeError("createCachemap expected use to be a plain object.");
    }

    if (use.client === "indexedDB" && window.Worker && window.indexedDB) {
      cachemap = await WorkerCachemap.create(args);
    } else {
      cachemap = await Cachemap.create(args);
    }
  } else {
    cachemap = await Cachemap.create(args);
  }

  return cachemap;
}
