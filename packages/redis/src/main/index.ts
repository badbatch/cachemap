import { type Store, type StoreInit, type StoreOptions } from '@cachemap/types';
import { isNumber, isPlainObject } from 'lodash-es';
import { type RedisClient, createClient } from 'redis';
import { type ConstructorOptions, type InitOptions, type Options } from '../types.ts';

export class RedisStore implements Store {
  public static init(options: InitOptions): Promise<RedisStore> {
    const { maxHeapSize, name, ...otherProps } = options;
    const client = createClient(otherProps);
    return Promise.resolve(new RedisStore({ client, maxHeapSize, name }));
  }

  public readonly type = 'redis';
  private _client: RedisClient;
  private readonly _maxHeapSize: number = Number.POSITIVE_INFINITY;
  private readonly _name: string;

  constructor(options: ConstructorOptions) {
    this._client = options.client;

    if (isNumber(options.maxHeapSize)) {
      this._maxHeapSize = options.maxHeapSize;
    }

    this._name = options.name;
  }

  public async clear(): Promise<void> {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      this._client.flushdb(error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  public async delete(key: string): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
      this._client.del(key, (error, reply) => {
        if (error) {
          reject(error);
        } else {
          resolve(!!reply);
        }
      });
    });
  }

  public async entries(keys: string[]): Promise<[string, string][]> {
    return new Promise((resolve: (value: [string, string][]) => void, reject: (reason: Error) => void) => {
      this._client.mget(keys, (error, reply) => {
        if (error) {
          reject(error);
        } else {
          const entries: [string, string][] = [];

          for (const [index, key] of keys.entries()) {
            const replyEntry = reply[index];

            if (replyEntry) {
              entries.push([key, replyEntry]);
            }
          }

          resolve(entries);
        }
      });
    });
  }

  public async get(key: string): Promise<string | undefined> {
    return new Promise((resolve: (value: string | undefined) => void, reject: (reason: Error) => void) => {
      this._client.get(key, (error, reply) => {
        if (error) {
          reject(error);
        } else {
          resolve(reply ?? undefined);
        }
      });
    });
  }

  public async has(key: string): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void, reject: (reason: Error) => void) => {
      this._client.exists(key, (error, reply) => {
        if (error) {
          reject(error);
        } else {
          resolve(!!reply);
        }
      });
    });
  }

  public async import(values: [string, string][]): Promise<void> {
    const entries: string[] = [];

    for (const [key, value] of values) {
      entries.push(key, JSON.stringify(value));
    }

    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      this._client.mset(entries, error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  get maxHeapSize() {
    return this._maxHeapSize;
  }

  get name() {
    return this._name;
  }

  public async set(key: string, value: string): Promise<void> {
    return new Promise((resolve: () => void, reject: (reason: Error) => void) => {
      this._client.set(key, JSON.stringify(value), error => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  public async size(): Promise<number> {
    return new Promise((resolve: (value: number) => void, reject: (reason: Error) => void) => {
      this._client.dbsize((error, reply) => {
        if (error) {
          reject(error);
        } else {
          // metadata is stored in the same DB as the
          // entries it describes, so we need to remove
          // one entry to get actual size
          resolve(reply - 1);
        }
      });
    });
  }
}

export const init = (options: Options = {}): StoreInit => {
  if (!isPlainObject(options)) {
    throw new TypeError('@cachemap/redis expected options to be a plain object.');
  }

  return (storeOptions: StoreOptions) => RedisStore.init({ ...options, ...storeOptions });
};
