import { expect } from "chai";
import { clientArgs, serverArgs, workerArgs } from "~/__test__";
import { Cachemap } from "~/cachemap";
import { DefaultCachemap } from "~/default-cachemap";
import { supportsWorkerIndexedDB } from "~/helpers/user-agent-parser";
import { WorkerCachemap } from "~/worker-cachemap";

describe("the Cachemap.create method", () => {
  if (process.env.WEB_ENV) {
    context("when the environment is a browser", () => {
      context("when use.client is set to 'indexedDB'", () => {
        it("the method should return an instance of the WorkerCachemap class that uses indexedDB", async () => {
          const cachemap = await Cachemap.create(workerArgs);

          if (supportsWorkerIndexedDB(self.navigator.userAgent)) {
            expect(cachemap).to.be.instanceof(WorkerCachemap);
          } else {
            expect(cachemap).to.be.instanceof(DefaultCachemap);
          }

          if (cachemap instanceof WorkerCachemap) cachemap.terminate();
        });
      });

      context("when use.client is set to 'localStorage'", () => {
        it("the method should return an instance of the Cachemap class that uses local storage", async () => {
          const cachemap = await Cachemap.create(clientArgs);
          expect(cachemap).to.be.instanceof(DefaultCachemap);
        });
      });
    });
  } else {
    context("when the environment is a server", () => {
      context("when use.server is set to 'redis'", () => {
        it("the method should return an instance of the Cachemap class that uses redis", async () => {
          const cachemap = await Cachemap.create(serverArgs);
          expect(cachemap).to.be.instanceof(DefaultCachemap);
        });
      });
    });
  }
});
