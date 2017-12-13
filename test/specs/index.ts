import { expect } from "chai";
import createCachemap from "../../src";
import Cachemap from "../../src/cachemap";
import WorkerCachemap from "../../src/worker-cachemap";
import { CachemapArgs } from "../../src/types";

const clientArgs: CachemapArgs = {
  name: "client",
  use: { client: "localStorage" },
};

const workerArgs: CachemapArgs = {
  name: "worker",
  use: { client: "indexedDB" },
};

const serverArgs: CachemapArgs = {
  name: "server",
  use: { server: "redis" },
};

describe("the createCachemap method", () => {
  if (process.env.WEB_ENV) {
    context("when use.client is set to 'indexedDB'", () => {
      it("the method should return an instance of the WorkerCachemap class", async () => {
        const workerCachemap = await createCachemap(workerArgs);
        expect(workerCachemap).to.be.instanceof(WorkerCachemap);
      });
    });

    context("when use.client is set to 'localStorage'", () => {
      it("the method should return an instance of the Cachemap class", async () => {
        const cachemap = await createCachemap(clientArgs);
        expect(cachemap).to.be.instanceof(Cachemap);
      });
    });
  } else {
    context("when use.server is set to 'redis'", async () => {
      const cachemap = await createCachemap(serverArgs);
      expect(cachemap).to.be.instanceof(Cachemap);
    });
  }
});
