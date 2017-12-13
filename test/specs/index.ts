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
  mockRedis: true,
  name: "server",
  use: { server: "redis" },
};

describe("the createCachemap method", () => {
  if (process.env.WEB_ENV) {
    context("when the environment is a browser", () => {
      context("when use.client is set to 'indexedDB'", () => {
        it("the method should return an instance of the WorkerCachemap class that uses indexedDB", async () => {
          const workerCachemap = await createCachemap(workerArgs);
          expect(workerCachemap).to.be.instanceof(WorkerCachemap);
        });
      });

      context("when use.client is set to 'localStorage'", () => {
        it("the method should return an instance of the Cachemap class that uses local storage", async () => {
          const cachemap = await createCachemap(clientArgs);
          expect(cachemap).to.be.instanceof(Cachemap);
        });
      });
    });
  } else {
    context("when the environment is a server", () => {
      context("when use.server is set to 'redis'", () => {
        it("the method should return an instance of the Cachemap class that uses redis", async () => {
          const cachemap = await createCachemap(serverArgs);
          expect(cachemap).to.be.instanceof(Cachemap);
        });
      });
    });
  }
});
