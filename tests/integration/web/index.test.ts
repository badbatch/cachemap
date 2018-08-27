import Core from "@cachemap/core";
import indexedDB from "@cachemap/indexed-db";
import localStorage from "@cachemap/local-storage";
import { run } from "../test-runner";

run(
  { cachemapSize: (value) => value, init: async (options: any) => Core.init(options) },
  "indexedDB",
  indexedDB,
);

run(
  { cachemapSize: (value) => value, init: async (options: any) => Core.init(options) },
  "localStorage",
  localStorage,
);
