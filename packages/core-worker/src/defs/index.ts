import { coreDefs } from "@cachemap/core";
import { reaperDefs } from "@cachemap/reaper";
import PromiseWorker from "promise-worker";

export interface CommonOptions {
  cacheHeaders?: coreDefs.CacheHeaders;
  deleteExpired?: boolean;
  hash?: boolean;
}

export interface ConstructorOptions {
  name: string;
  promiseWorker: PromiseWorker;
  worker: Worker;
}

export interface CreateOptions {
  disableCacheInvalidation?: boolean;
  maxHeapSize?: number;
  name: string;
  reaperOptions?: reaperDefs.Options;
}

export interface InitOptions extends CreateOptions {
  workerFilename?: string;
}

export interface PostMessage {
  options?: CommonOptions | CreateOptions | coreDefs.ExportOptions | coreDefs.ImportOptions;
  key?: string;
  keys?: string[];
  type: string;
  value?: any;
}

export interface PostMessageResult {
  metadata: coreDefs.Metadata[];
  result?: any;
  usedHeapSize: number;
}
