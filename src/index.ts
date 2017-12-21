import { isPlainObject } from "lodash";
import DefaultCachemap from "./cachemap";
import { ConstructorArgs } from "./types";
import WorkerCachemap from "./worker-cachemap";

declare global {
  interface Window {
      Worker: Worker;
  }
}

export type Cachemap = DefaultCachemap | WorkerCachemap;
export type CachemapArgs = ConstructorArgs;

export default async function createCachemap(args: CachemapArgs): Promise<Cachemap> {
  if (!isPlainObject(args)) {
    throw new TypeError("createCachemap expected args to ba a plain object.");
  }

  let cachemap: Cachemap;

  if (process.env.WEB_ENV) {
    const { use = {} } = args;

    if (!isPlainObject(use)) {
      throw new TypeError("createCachemap expected use to be a plain object.");
    }

    if (use.client === "indexedDB" && window.Worker && window.indexedDB) {
      cachemap = await WorkerCachemap.create(args);
    } else {
      cachemap = await DefaultCachemap.create(args);
    }
  } else {
    cachemap = await DefaultCachemap.create(args);
  }

  return cachemap;
}
