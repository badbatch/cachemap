import { isPlainObject } from "lodash";
import { DefaultCachemap } from "../default-cachemap";
import { ConstructorArgs } from "../types";
import { WorkerCachemap } from "../worker-cachemap";

declare global {
  interface Window {
      Worker: Worker;
  }
  interface WorkerGlobalScope {
    Worker: Worker;
  }
}

export class Cachemap {
  public static async create(args: ConstructorArgs): Promise<DefaultCachemap | WorkerCachemap> {
    if (!isPlainObject(args)) {
      throw new TypeError("createCachemap expected args to ba a plain object.");
    }

    let cachemap: DefaultCachemap | WorkerCachemap;

    if (process.env.WEB_ENV) {
      const { use = {} } = args;

      if (!isPlainObject(use)) {
        throw new TypeError("createCachemap expected use to be a plain object.");
      }

      if (use.client === "indexedDB" && self.Worker && self.indexedDB) {
        cachemap = await WorkerCachemap.create(args);
      } else {
        cachemap = await DefaultCachemap.create(args);
      }
    } else {
      cachemap = await DefaultCachemap.create(args);
    }

    return cachemap;
  }
}
