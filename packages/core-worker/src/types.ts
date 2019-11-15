import Core, { CacheHeaders, ExportOptions, ImportOptions, Metadata } from "@cachemap/core";

export interface CommonOptions {
  cacheHeaders?: CacheHeaders;
  deleteExpired?: boolean;
  hash?: boolean;
}

export interface ConstructorOptions {
  worker: Worker;
}

export type PendingResolver = (value: PostMessageResultWithoutMeta) => void;

export interface PendingData {
  resolve: PendingResolver;
}

export type PendingTracker = Map<string, PendingData>;

export interface PostMessageWithoutMeta {
  key?: string;
  keys?: string[];
  method: string;
  options?: CommonOptions | ExportOptions | ImportOptions;
  value?: any;
}

export interface PostMessage extends PostMessageWithoutMeta {
  messageID: string;
  type: string;
}

export interface PostMessageResultWithoutMeta {
  metadata: Metadata[];
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
  metadata: Metadata[];
  storeType: string;
  usedHeapSize: number;
}
