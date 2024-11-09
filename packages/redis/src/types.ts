import { type ClientOpts, type RedisClient } from 'redis';

export interface ConstructorOptions {
  client: RedisClient;
  maxHeapSize?: number;
  name: string;
}

export interface InitOptions extends Options {
  name: string;
}

export interface Options extends ClientOpts {
  maxHeapSize?: number;
}
