import Core from "@cachemap/core";
import { registerWorker } from "@cachemap/core-worker";
import map from "@cachemap/map";

(async () => {
  const cachemap = await Core.init({
    name: "worker-integration-tests",
    store: map(),
  });

  registerWorker({ cachemap });
})();
