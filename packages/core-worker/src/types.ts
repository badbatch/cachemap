import Core, { CacheHeaders, ExportOptions, ImportOptions } from "@cachemap/core";
import { Metadata } from "@cachemap/types";

export interface CommonOptions {
  cacheHeaders?: CacheHeaders;
  deleteExpired?: boolean;
  hash?: boolean;
}

export interface ConstructorOptions {
  name: string;
  type: string;
  worker: Worker;
}

export type PendingResolver = (value: PostMessageResultWithMeta) => void;

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

export interface PostMessageResultWithMeta {
  metadata: Metadata[];
  result?: any;
  storeType: string;
  usedHeapSize: number;
}

export interface PostMessageResult extends PostMessageResultWithMeta {
  messageID: string;
  method: string;
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
