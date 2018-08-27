import Core from "@cachemap/core";
import map from "@cachemap/map";
import redis from "@cachemap/redis";
import { run } from "../test-runner";

run(redis, "redis", { mock: true }, {
  cachemapSize: (value) => value,
  init: async (options: any) => Core.init(options),
});

run(map, "map", undefined, {
  cachemapSize: (value) => value - 1,
  init: async (options: any) => Core.init(options),
});
