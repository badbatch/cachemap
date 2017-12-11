import redis, { ClientOpts, RedisClient } from "redis";

export default class RedisProxy {
  private _client: RedisClient;

  constructor(options?: ClientOpts) {
    this._client = redis.createClient(options);
  }

  public async clear(): Promise<void> {
    await new Promise((resolve) => {
      this._client.flushdb((err, reply) => {
        resolve();
      });
    });
  }

  public async delete(key: string): Promise<void> {
    await new Promise((resolve) => {
      this._client.del(key, (err, reply) => {
        resolve();
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
