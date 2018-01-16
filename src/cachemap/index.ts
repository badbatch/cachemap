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

/**
 * An isomorphic cache that works on the server, browser
 * and in web workers, that can use Redis, LocalStorage,
 * IndexedDB or an in-memory Map.
 *
 * ```typescript
 * import { Cachemap } from "cachemap";
 * const cachemap = await Cachemap.create({
 *   name: "alfa",
 *   use: { client: "localStorage", server: "redis" },
 * });
 * ```
 *
 */
export class Cachemap {
  /**
   * The method creates an instance of either DefaultCachemap for
   * the server, DefaultCachemap for the browser, or WorkerCachemap,
   * based on whether the WEB_ENV environment variable is set to "true"
   * and whether the environment supports web workers.
   *
   * ```typescript
   * const cachemap = await Cachemap.create({
   *   name: "alfa",
   *   use: { client: "localStorage", server: "redis" },
   * });
   * ```
   *
   */
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
