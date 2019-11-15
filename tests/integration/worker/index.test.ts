import CoreWorker from "@cachemap/core-worker";
import { run } from "../test-runner";

run(
  {
    cachemapSize: value => value - 1,
    init: (options: any) => new CoreWorker(options),
    worker: new Worker("worker.js"),
  },
  "indexedDB",
);
