import Core, { coreDefs } from "@cachemap/core";

export interface CommonOptions {
  cacheHeaders?: coreDefs.CacheHeaders;
  deleteExpired?: boolean;
  hash?: boolean;
}

export interface InitOptions {
  worker: Worker;
}

export type ConstructorOptions = InitOptions;

export type PendingResolver = (value: PostMessageResultWithoutMeta) => void;

export interface PendingData {
  resolve: PendingResolver;
}

export type PendingTracker = Map<string, PendingData>;

export interface PostMessageWithoutMeta {
  key?: string;
  keys?: string[];
  method: string;
  options?: CommonOptions | coreDefs.ExportOptions | coreDefs.ImportOptions;
  value?: any;
}

export interface PostMessage extends PostMessageWithoutMeta {
  messageID: string;
  type: string;
}

export interface PostMessageResultWithoutMeta {
  metadata: coreDefs.Metadata[];
  result?: any;
  storeType: string;
  usedHeapSize: number;
}

export interface PostMessageResult extends PostMessageResultWithoutMeta {
  messageID: string;
  type: string;
}

export interface RegisterWorkerOptions {
  cachemap: Core;
}

export interface FilterPropsResult {
  metadata: coreDefs.Metadata[];
  storeType: string;
  usedHeapSize: number;
}
