import PromiseWorker from "promise-worker";
import { core, reaper } from "../..";

export interface CommonOptions {
  cacheHeaders?: core.CacheHeaders;
  deleteExpired?: boolean;
  hash?: boolean;
}

export interface ConstructorOptions {
  promiseWorker: PromiseWorker;
  worker: Worker;
}

export interface CreateOptions {
  disableCacheInvalidation?: boolean;
  maxHeapSize?: number;
  name: string;
  reaperOptions?: reaper.Options;
}

export interface InitOptions extends CreateOptions {
  workerFilename?: string;
}

export interface PostMessage {
  options?: CommonOptions | CreateOptions | core.ExportOptions | core.ImportOptions;
  key?: string;
  keys?: string[];
  type: string;
  value?: any;
}

export interface PostMessageResult {
  metadata: core.Metadata[];
  result?: any;
  usedHeapSize: number;
}
