import { isPlainObject } from "lodash";
import { ClientOpts, createClient, RedisClient } from "redis";

export default class RedisProxy {
  private _client: RedisClient;

  constructor(opts: ClientOpts = {}, mock?: boolean) {
    if (!isPlainObject(opts)) {
      throw new TypeError("constructor expected opts to be a plain object.");
    }

    if (mock) {
      const fakeRedis = require("fakeredis");
      this._client = fakeRedis.createClient(opts.port, opts.host, { ...opts, fast: true });
    } else {
      this._client = createClient(opts);
    }
  }

  public async clear(): Promise<void> {
    await new Promise((resolve) => {
      this._client.flushdb((err, reply) => {
        resolve();
      });
    });
  }

  public async delete(key: string): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void) => {
      this._client.del(key, (err, reply) => {
        resolve(!!reply);
      });
    });
  }

  public async get(key: string): Promise<any> {
    return new Promise((resolve: (value: any) => void) => {
      this._client.get(key, (err, reply) => {
        resolve(JSON.parse(reply));
      });
    });
  }

  public async has(key: string): Promise<boolean> {
    return new Promise((resolve: (value: boolean) => void) => {
      this._client.exists(key, (err, reply) => {
        resolve(!!reply);
      });
    });
  }

  public async set(key: string, value: any): Promise<void> {
    await new Promise((resolve) => {
      this._client.set(key, JSON.stringify(value), (err, reply) => {
        resolve();
      });
    });
  }

  public async size(): Promise<number> {
    return new Promise((resolve: (value: number) => void) => {
      this._client.dbsize((err, reply) => {
        resolve(reply);
      });
    });
  }
}
