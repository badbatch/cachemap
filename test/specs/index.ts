import Cacheability from "cacheability";
import { expect } from "chai";
import * as delay from "delay";
import testData from "../data";
import createCachemap from "../../src";
import Cachemap from "../../src/cachemap";
import WorkerCachemap from "../../src/worker-cachemap";

import {
  CacheHeaders,
  CachemapArgs,
  Metadata,
  ObjectMap,
} from "../../src/types";

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
          const workerCachemap = await createCachemap(workerArgs) as WorkerCachemap;
          expect(workerCachemap).to.be.instanceof(WorkerCachemap);
          workerCachemap.terminate();
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

function testCachemapClass(args: CachemapArgs): void {
  describe(`the cachemap class for the ${args.name}`, () => {
    let cachemap: Cachemap | WorkerCachemap;

    describe("the has method", () => {
      const key: string = testData["136-7317"].url;
      const value: ObjectMap = testData["136-7317"].body;
      const cacheHeaders: CacheHeaders = { cacheControl: "public, max-age=1" };
      const hash = true;

      before(async () => {
        cachemap = await createCachemap(args);
        await cachemap.set(key, value, { cacheHeaders, hash });
      });

      after(async () => {
        await cachemap.clear();
        if (cachemap instanceof WorkerCachemap) cachemap.terminate();
      });

      context("when a key exists in the cachemap", () => {
        it("then the method should return the key's cacheability object", async () => {
          const cacheability = await cachemap.has(key, { hash }) as Cacheability;
          expect(cacheability).to.be.instanceof(Cacheability);
          const cacheControl = cacheability.metadata.cacheControl;
          expect(cacheControl.public).to.equal(true);
          expect(cacheControl.maxAge).to.equal(1);
        });
      });

      context("when an expired key exists in the cachemap and deleteExpired is passed in", () => {
        it("then the method should return false and delete the expired key/value pair", async () => {
          await delay(1000);
          const cacheability = await cachemap.has(key, { deleteExpired: true, hash }) as false;
          expect(cacheability).to.equal(false);
          expect(await cachemap.size()).to.equal(1);
          expect(cachemap.metadata).lengthOf(0);
        });
      });

      context("when no key exists in the cachemap", () => {
        it("then the method should return false", async () => {
          const cacheability = await cachemap.has(key, { hash }) as false;
          expect(cacheability).to.equal(false);
        });
      });
    });

    describe("the set method", () => {
      const key: string = testData["136-7317"].url;
      const value: ObjectMap = testData["136-7317"].body;
      const cacheHeaders: CacheHeaders = { cacheControl: "public, max-age=1" };
      const hash = true;
      let metadata: Metadata;

      before(async () => {
        cachemap = await createCachemap(args);
      });

      after(async () => {
        await cachemap.clear();
        if (cachemap instanceof WorkerCachemap) cachemap.terminate();
      });

      context("when a key does not exist in the cachemap", () => {
        it("then the method should store the pair and add its metadata", async () => {
          await cachemap.set(key, value, { cacheHeaders, hash });
          expect(await cachemap.size()).to.eql(2);
          expect(cachemap.metadata).lengthOf(1);
          metadata = { ...cachemap.metadata[0] };
          expect(metadata.accessedCount).to.equal(0);
          expect(metadata.added).to.be.a("number");
          expect(metadata.cacheability).to.be.instanceOf(Cacheability);
          expect(metadata.key).to.be.a("string");
          expect(metadata.lastAccessed).to.be.a("number");
          expect(metadata.lastUpdated).to.be.a("number");
          expect(metadata.size).to.be.a("number");
        });
      });

      context("when a key already exists in the cachemap", () => {
        it("then the method should overwrite the existing value and update the metadata", async () => {
          await cachemap.set(key, value, { cacheHeaders, hash });
          expect(await cachemap.size()).to.eql(2);
          expect(cachemap.metadata).lengthOf(1);
          const updatedMetadata = cachemap.metadata[0];
          expect(updatedMetadata.accessedCount).to.equal(0);
          expect(updatedMetadata.added).to.equal(metadata.added);
          expect(updatedMetadata.cacheability.metadata.ttl).to.be.above(metadata.cacheability.metadata.ttl);
          expect(updatedMetadata.key).to.equal(metadata.key);
          expect(updatedMetadata.lastAccessed).to.equal(metadata.lastAccessed);
          expect(updatedMetadata.lastUpdated).to.be.above(metadata.lastUpdated);
          expect(updatedMetadata.size).to.equal(metadata.size);
        });
      });
    });
  });
}

const cachemapArgs: CachemapArgs[] = process.env.WEB_ENV ? [clientArgs, workerArgs] : [serverArgs];

cachemapArgs.forEach((args) => {
  testCachemapClass(args);
});
