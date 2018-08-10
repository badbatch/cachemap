import { coreDefs } from "@cachemap/core";
import * as fakeRedis from "fakeredis";
import { isNumber, isPlainObject } from "lodash";
import { createClient, RedisClient } from "redis";
import { ConstructorOptions, InitOptions, Options } from "../defs";

export class RedisStore implements coreDefs.Store {
  public static async init(options: InitOptions): Promise<RedisStore> {
    const { fast, maxHeapSize, mock, name, ...otherProps } = options;

    try {
      const client = mock ? createClient(otherProps) : fakeRedis.createClient({ ...otherProps, fast });
      return new RedisStore({ client, maxHeapSize, name });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public readonly type = "redis";
  private _client: RedisClient;
  private _maxHeapSize: number = Infinity;
  private _name: string;

  constructor(options: ConstructorOptions) {
    this._client = options.client;

    if (isNumber(options.maxHeapSize)) {
      this._maxHeapSize = options.maxHeapSize;
    }

    this._name = options.name;
  }

  get maxHeapSize() {
    return this._maxHeapSize;
  }

  get name() {
    return this._name;
  }

  public async clear(): Promise<void> {
    return new Promise((resolve: (value: undefined) => void, reject: (reason: Error) => void) => {
      this._client.flushdb((error) => {
        if (error) {
           reject(error);
        } else {
          resolve(undefined);
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

  public async entries(keys?: string[]): Promise<Array<[string, any]>> {
    const _keys = keys as string[];

    return new Promise((resolve: (value: Array<[string, any]>) => void, reject: (reason: Error) => void) => {
      this._client.mget(_keys, (error, reply) => {
        if (error) {
          reject(error);
        } else {
          const entries: Array<[string, any]> = [];

          _keys.forEach((key, index) => {
            entries.push([key, JSON.parse(reply[index])]);
          });

          resolve(entries);
        }
      });
    });
  }

  public async get(key: string): Promise<any> {
    return new Promise((resolve: (value: any) => void, reject: (reason: Error) => void) => {
      this._client.get(key, (error, reply) => {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(reply));
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

  public async import(entries: Array<[string, any]>): Promise<void> {
    const _entries: string[] = [];

    entries.forEach(([key, value]) => {
      _entries.push(key, JSON.stringify(value));
    });

    return new Promise((resolve: (value: undefined) => void, reject: (reason: Error) => void) => {
      this._client.mset(_entries, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(undefined);
        }
      });
    });
  }

  public async set(key: string, value: any): Promise<void> {
    return new Promise((resolve: (value: undefined) => void, reject: (reason: Error) => void) => {
      this._client.set(key, JSON.stringify(value), (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(undefined);
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
          resolve(reply);
        }
      });
    });
  }
}

export default function init(options: Options = {}): coreDefs.StoreInit {
  if (!isPlainObject(options)) {
    throw new TypeError("@cachemap/redis expected options to be a plain object.");
  }

  return (storeOptions: coreDefs.StoreOptions) => RedisStore.init({ ...options, ...storeOptions });
}
