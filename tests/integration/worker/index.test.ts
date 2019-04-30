import CoreWorker from "@cachemap/core-worker";
import { run } from "../test-runner";

run(
  {
    cachemapSize: (value) => value - 1,
    init: async (options: any) => CoreWorker.init(options),
    worker: new Worker("worker.js"),
  },
  "indexedDB",
);
