import { isPlainObject } from "lodash";
import { ClientOpts, createClient, RedisClient } from "redis";

export default class RedisProxy {
  private _client: RedisClient;

  constructor(opts: ClientOpts = {}, mock?: boolean) {
    if (!isPlainObject(opts)) {
      throw new TypeError("constructor expected opts to be a plain object.");
    }

    try {
      if (mock) {
        const fakeRedis = require("fakeredis");
        this._client = fakeRedis.createClient(opts.port, opts.host, { ...opts, fast: true });
      } else {
        this._client = createClient(opts);
      }
    } catch (error) {
      throw error;
    }
  }

  public async clear(): Promise<void> {
    return new Promise((resolve: (value: undefined) => void, reject: (reason: Error) => void) => {
      this._client.flushdb((error, reply) => {
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

  public async set(key: string, value: any): Promise<void> {
    return new Promise((resolve: (value: undefined) => void, reject: (reason: Error) => void) => {
      this._client.set(key, JSON.stringify(value), (error, reply) => {
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
