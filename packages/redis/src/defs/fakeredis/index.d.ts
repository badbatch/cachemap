declare module "fakeredis" {
  import { ClientOpts, RedisClient } from "redis";

  export interface FakeClientOpts extends ClientOpts {
    fast?: boolean;
  }

  export function createClient(options?: FakeClientOpts): RedisClient;
}
