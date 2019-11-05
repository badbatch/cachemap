import Core from "@cachemap/core";
import indexedDB from "@cachemap/indexed-db";
import localStorage from "@cachemap/local-storage";
import map from "@cachemap/map";
import { run } from "../test-runner";

run({ cachemapSize: value => value, init: async (options: any) => Core.init(options) }, "indexedDB", indexedDB);

run({ cachemapSize: value => value, init: async (options: any) => Core.init(options) }, "localStorage", localStorage);

run({ cachemapSize: value => value - 1, init: async (options: any) => Core.init(options) }, "map", map);
