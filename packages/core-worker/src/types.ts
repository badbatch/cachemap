import { type CacheHeaders, type Core, type ExportOptions, type ImportOptions } from '@cachemap/core';
import { type Metadata } from '@cachemap/types';

export interface CommonOptions {
  cacheHeaders?: CacheHeaders;
  deleteExpired?: boolean;
  hashKey?: boolean;
}

export interface ConstructorOptions {
  name: string;
  type: string;
  worker: Worker;
}

export type PendingResolver<T> = (value: PostMessageResultWithMeta<T>) => void;

export interface PendingData<T> {
  resolve: PendingResolver<T>;
}

export type PendingTracker = Map<string, PendingData<never>>;

export interface PostMessageWithoutMeta {
  key?: string;
  keys?: string[];
  method: string;
  options?: CommonOptions | ExportOptions | ImportOptions;
  value?: unknown;
}

export interface PostMessage extends PostMessageWithoutMeta {
  messageID: string;
  type: string;
}

export type PostMessageResultWithMeta<T> = {
  metadata: Metadata[];
  result: T;
  storeType: string;
  usedHeapSize: number;
};

export type PostMessageResult<T> = PostMessageResultWithMeta<T> & {
  messageID: string;
  method: string;
  type: string;
};

export interface RegisterWorkerOptions {
  cachemap: Core;
}

export interface FilterPropsResult {
  metadata: Metadata[];
  storeType: string;
  usedHeapSize: number;
}
