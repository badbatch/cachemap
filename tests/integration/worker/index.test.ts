import CoreWorker from "@cachemap/core-worker";
import { run } from "../test-runner";

run(
  { cachemapSize: (value) => value, init: async (options: any) => CoreWorker.init(options) },
  "indexedDB",
);
