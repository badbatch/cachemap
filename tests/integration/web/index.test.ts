import Core from "@cachemap/core";
import indexedDB from "@cachemap/indexed-db";
import localStorage from "@cachemap/local-storage";
import { run } from "../test-runner";

run(indexedDB, "indexedDB", undefined, {
  cachemapSize: (value) => value,
  init: async (options: any) => Core.init(options),
});

run(localStorage, "localStorage", undefined, {
  cachemapSize: (value) => value,
  init: async (options: any) => Core.init(options),
});
