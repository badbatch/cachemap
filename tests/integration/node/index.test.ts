import map from "@cachemap/map";
import redis from "@cachemap/redis";
import { run } from "../test-runner";

run(redis, "redis", { mock: true });
run(map, "map", undefined, { cachemapSize: (value) => value - 1 });
