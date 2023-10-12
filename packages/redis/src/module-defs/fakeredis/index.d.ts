declare module 'fakeredis' {
  import { type ClientOpts, type RedisClient } from 'redis';

  export interface FakeClientOptions extends ClientOpts {
    fast?: boolean;
  }

  export function createClient(options?: FakeClientOptions): RedisClient;
}
