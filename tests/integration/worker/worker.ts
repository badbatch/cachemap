import Core from "@cachemap/core";
import { registerWorker } from "@cachemap/core-worker";
import map from "@cachemap/map";

const cachemap = new Core({
  name: "worker-integration-tests",
  store: map(),
  type: "integration-tests",
});

registerWorker({ cachemap });
