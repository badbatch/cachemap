import { type Controller } from '@cachemap/controller';
import { type Core, type ExportOptions, type ImportOptions } from '@cachemap/core';
import {
  type EntriesOptions,
  type ExportResult,
  type Metadata,
  type MethodOptions,
  type SetOptions,
  type WriteOptions,
} from '@cachemap/types';

export type AnyPostMessageResponse<T = unknown> = {
  [M in PostMessageMethod]: PostMessageResponse<M, PostMessageResultMap<T>[M]>;
}[PostMessageMethod];

export interface CoreWorkerOptions {
  /**
   * Instance of the Controller, a thin command bus for controlling multiple
   * instances of a cachemap.
   */
  controller?: Controller;
  /**
   * Must be passed in as true if you are going to
   * initialize the worker after the constructor.
   */
  lazyWorkerInit?: boolean;
  /**
   * The name is primarily used as a target for the controller, in order
   * to centrally control the cachemap in an application with multiple
   * instances.
   */
  name: string;
  /**
   * Callback that will execute if the initialization of the backup store fails.
   */
  onError?: (error: unknown) => void;
  /**
   * The type is primarily used as a target for the controller, in order
   * to centrally control a group of cachemaps in an application with multiple
   * instances.
   */
  type?: string;
  worker?: Worker | (() => Worker | Promise<Worker>);
}

export type EnrichedPostMessage = PostMessageRequest & {
  messageId: string;
  type: 'cachemap';
};

export interface MetadataAndUsedHeapSize {
  backupStoreType: string;
  metadata: Metadata[];
  usedHeapSize: number;
}

export interface PendingData {
  reject: (error: unknown) => void;
  resolve: (value: AnyPostMessageResponse) => void;
}

export type PendingResolver<M extends PostMessageMethod, T = unknown> = (value: PostMessageResponse<M, T>) => void;

export type PendingTracker = Map<string, PendingData>;

export type PostMessageRequestMap = {
  controller: {
    cmd: 'clear' | 'startReaper' | 'stopReaper' | 'startBackup' | 'stopBackup';
  };
  delete: {
    key: string;
    options?: WriteOptions;
  };
  entries: {
    keys?: string[];
    options?: EntriesOptions;
  };
  exists: {
    key: string;
    options?: MethodOptions;
  };
  export: {
    options?: ExportOptions;
  };
  fetch: {
    key: string;
    options?: MethodOptions;
  };
  fetchEntries: {
    keys?: string[];
    options?: EntriesOptions;
  };
  get: {
    key: string;
    options?: MethodOptions;
  };
  has: {
    key: string;
    options?: MethodOptions;
  };
  import: {
    options: ImportOptions;
  };
  remove: {
    key: string;
    options?: WriteOptions;
  };
  set: {
    key: string;
    options?: SetOptions;
    value: unknown;
  };
  write: {
    key: string;
    options?: SetOptions;
    value: unknown;
  };
};

export type PostMessageRequestMethods = keyof PostMessageRequestMap | 'clear' | 'controller' | 'flush';

export type PostMessageRequest = {
  [M in PostMessageRequestMethods]: { method: M } & (M extends keyof PostMessageRequestMap
    ? PostMessageRequestMap[M]
    : object);
}[PostMessageRequestMethods];

export type PostMessageMethod =
  | 'clear'
  | 'controller'
  | 'delete'
  | 'entries'
  | 'entryDeleted'
  | 'exists'
  | 'export'
  | 'fetch'
  | 'fetchEntries'
  | 'flush'
  | 'get'
  | 'has'
  | 'import'
  | 'remove'
  | 'set'
  | 'write';

export type PostMessageResultMap<T> = {
  clear: undefined;
  controller: undefined;
  delete: boolean;
  entries: [string, T][];
  entryDeleted: {
    deleted: boolean;
    key: string;
    tags?: string[];
  };
  exists: boolean;
  export: ExportResult<T>;
  fetch: T | undefined;
  fetchEntries: [string, T][];
  flush: undefined;
  get: T | undefined;
  has: boolean;
  import: undefined;
  remove: boolean;
  set: undefined;
  write: undefined;
};

type PostMessageResponseBase<M extends PostMessageMethod> = {
  error?: unknown;
  messageId: string;
  method: M;
  type: 'cachemap';
};

export type PostMessageResponse<M extends PostMessageMethod, T = unknown> = PostMessageResponseBase<M> & {
  result: PostMessageResultMap<T>[M];
} & MetadataAndUsedHeapSize;

export interface RegisterWorkerOptions {
  cachemap: Core;
}
