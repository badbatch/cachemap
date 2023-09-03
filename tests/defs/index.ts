import type Core from '@cachemap/core';
import type CoreWorker from '@cachemap/core-worker';

export type PlainObject = Record<string, any>;

export interface RunOptions {
  cachemapSize: (value: number) => number;
  init(options: PlainObject): Core | CoreWorker;
  worker?: Worker;
}
