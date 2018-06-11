import { expect } from "chai";
import { clientArgs, mapArgs, serverArgs, testData, workerArgs } from "~/.test";
import { Cachemap } from "~/cachemap";
import { DefaultCachemap } from "~/default-cachemap";
import { CacheHeaders, ConstructorArgs, ObjectMap, ReaperOptions } from "~/types";
import { WorkerCachemap } from "~/worker-cachemap";

function testReaperClass(args: ConstructorArgs): void {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const key: string = testData["136-7317"].url;
  const value: ObjectMap = testData["136-7317"].body;
  const cacheHeaders: CacheHeaders = { cacheControl: "public, max-age=1" };
  const hash = true;
  let cachemap: DefaultCachemap | WorkerCachemap;
  let usingMap = args.name === "map";

  describe("the Reaper class", () => {
    before(async () => {
      const maxHeapSize = { client: 30000, server: 30000 };
      const reaperOptions: ReaperOptions = { interval: 1000 };
      cachemap = await Cachemap.create({ ...args, maxHeapSize, reaperOptions });
      usingMap = cachemap.storeType === "map";
      await cachemap.clear();
    });

    after(async () => {
      if (cachemap instanceof WorkerCachemap) cachemap.terminate();
    });

    context("when a key/value in the cachemap has expired", () => {
      before(async () => {
        await cachemap.set(key, value, { cacheHeaders: { cacheControl: "public, max-age=0" }, hash });
      });

      after(async () => {
        await cachemap.clear();
      });

      it("then the class instance should delete the key/value and its metadata", async () => {
        if (usingMap) {
          expect(await cachemap.size()).to.eql(1);
        } else {
          expect(await cachemap.size()).to.eql(2);
        }

        expect(cachemap.metadata).lengthOf(1);
        await delay(1500);

        if (usingMap) {
          expect(await cachemap.size()).to.eql(0);
        } else {
          expect(await cachemap.size()).to.eql(1);
        }

        expect(cachemap.metadata).lengthOf(0);
      });
    });

    context("when the cachemap heap size exceeds its threshold", () => {
      let lastKey: string;

      before(async () => {
        const keys = Object.keys(testData);
        lastKey = keys.splice(2, 1)[0];

        await Promise.all(keys.map((id) => cachemap.set(
          testData[id].url,
          testData[id].body,
          { cacheHeaders: { cacheControl: "public, max-age=60" }, hash },
        )));
      });

      after(async () => {
        await cachemap.clear();
      });

      it("then the class instance should delete the necessary key/values and their metadata", async () => {
        if (usingMap) {
          expect(await cachemap.size()).to.eql(2);
        } else {
          expect(await cachemap.size()).to.eql(3);
        }

        expect(cachemap.metadata).lengthOf(2);
        await cachemap.set(testData[lastKey].url, testData[lastKey].body, { cacheHeaders, hash });

        if (usingMap) {
          expect(await cachemap.size()).to.eql(2);
        } else {
          expect(await cachemap.size()).to.eql(3);
        }

        expect(cachemap.metadata).lengthOf(2);
      });
    });
  });
}

if (process.env.WEB_ENV) {
  testReaperClass(clientArgs);
  testReaperClass(workerArgs);
} else {
  testReaperClass(serverArgs);
  testReaperClass(mapArgs);
}
