import { Cacheability } from "cacheability";
import { expect } from "chai";
import { get } from "lodash";
import * as sinon from "sinon";
import testData from "../data";
import { Cachemap, DefaultCachemap, WorkerCachemap } from "../../src";
import { supportsWorkerIndexedDB } from "../../src/helpers/user-agent-parser";

import {
  CacheHeaders,
  ConstructorArgs,
  ExportResult,
  Metadata,
  ObjectMap,
  ReaperOptions,
  StoreProxyTypes,
} from "../../src/types";

const clientArgs: ConstructorArgs = {
  name: "client",
  use: { client: "localStorage" },
};

const workerArgs: ConstructorArgs = {
  indexedDBOptions: {
    databaseName: "alfa-database",
    objectStoreName: "alfa",
  },
  name: "worker",
  use: { client: "indexedDB" },
};

const serverArgs: ConstructorArgs = {
  mockRedis: true,
  name: "server",
  use: { server: "redis" },
};

const mapArgs: ConstructorArgs = {
  name: "map",
  use: { server: "map" },
};

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

function testCachemapClass(args: ConstructorArgs): void {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const key: string = testData["136-7317"].url;
  const value: ObjectMap = testData["136-7317"].body;
  const cacheHeaders: CacheHeaders = { cacheControl: "public, max-age=1" };
  const hash = true;
  let cachemap: DefaultCachemap | WorkerCachemap;
  let usingMap = args.name === "map";

  describe(`the cachemap class for the ${args.name}`, () => {
    before(async () => {
      cachemap = await Cachemap.create(args);
      usingMap = cachemap.storeType === "map";
      await cachemap.clear();
    });

    after(async () => {
      if (cachemap instanceof WorkerCachemap) cachemap.terminate();
    });

    describe("the delete method", () => {
      beforeEach(async () => {
        await cachemap.set(key, value, { cacheHeaders, hash });
      });

      afterEach(async () => {
        await cachemap.clear();
      });

      context("when a key exists in the cachemap", () => {
        it("then the method should delete the key/value pair", async () => {
          await cachemap.delete(key, { hash });

          if (usingMap) {
            expect(await cachemap.size()).to.eql(0);
          } else {
            expect(await cachemap.size()).to.eql(1);
          }

          expect(cachemap.metadata).lengthOf(0);
        });
      });

      context("when the database throws an exception", () => {
        const message = "Oops, there seems to be a problem";
        let stub: sinon.SinonStub;

        beforeEach(() => {
          if (args.name === "worker") return;
          const storeClient: StoreProxyTypes = get(cachemap, ["_store"]);
          const error = new Error(message);
          stub = sinon.stub(storeClient, "set").rejects(error);
        });

        afterEach(() => {
          if (args.name === "worker") return;
          stub.restore();
        });

        it("then the method should return a rejected promise with the reason", async () => {
          let _key = key;
          let _message = message;

          if (args.name === "worker") {
            _key = "";
            _message = "Worker expected key to have a length greather than 0.";
          }

          try {
            await cachemap.delete(_key, { hash });
          } catch (error) {
            expect(error.message).to.equal(_message);
          }
        });
      });
    });

    describe("the get method", () => {
      let metadata: Metadata;

      beforeEach(async () => {
        await cachemap.set(key, value, { cacheHeaders, hash });
        metadata = { ...cachemap.metadata[0] };
      });

      afterEach(async () => {
        await cachemap.clear();
      });

      context("when a key exists in the cachemap", () => {
        it("then the method should return the value and update the metadata", async () => {
          const result = await cachemap.get(key, { hash });
          expect(result).to.deep.equal(value);
          const updatedMetadata = cachemap.metadata[0];
          expect(updatedMetadata.accessedCount).to.equal(1);
          expect(updatedMetadata.added).to.equal(metadata.added);
          expect(updatedMetadata.cacheability).to.deep.equal(metadata.cacheability);
          expect(updatedMetadata.key).to.equal(metadata.key);
          expect(updatedMetadata.lastAccessed >= metadata.lastAccessed).to.equal(true);
          expect(updatedMetadata.lastUpdated).to.equal(metadata.lastUpdated);
          expect(updatedMetadata.size).to.equal(metadata.size);
        });
      });

      context("when the database throws an exception", () => {
        const message = "Oops, there seems to be a problem";
        let stub: sinon.SinonStub;

        beforeEach(() => {
          if (args.name === "worker") return;
          const storeClient: StoreProxyTypes = get(cachemap, ["_store"]);
          const error = new Error(message);
          stub = sinon.stub(storeClient, "set").rejects(error);
        });

        afterEach(() => {
          if (args.name === "worker") return;
          stub.restore();
        });

        it("then the method should return a rejected promise with the reason", async () => {
          let _key = key;
          let _message = message;

          if (args.name === "worker") {
            _key = "";
            _message = "Worker expected key to have a length greather than 0.";
          }

          try {
            await cachemap.get(_key, { hash });
          } catch (error) {
            expect(error.message).to.equal(_message);
          }
        });
      });
    });

    describe("the has method", () => {
      before(async () => {
        await cachemap.set(key, value, { cacheHeaders, hash });
      });

      after(async () => {
        await cachemap.clear();
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

          if (usingMap) {
            expect(await cachemap.size()).to.eql(0);
          } else {
            expect(await cachemap.size()).to.eql(1);
          }

          expect(cachemap.metadata).lengthOf(0);
        });
      });

      context("when no key exists in the cachemap", () => {
        it("then the method should return false", async () => {
          const cacheability = await cachemap.has(key, { hash }) as false;
          expect(cacheability).to.equal(false);
        });
      });

      context("when the database throws an exception", () => {
        const message = "Oops, there seems to be a problem";
        let stub: sinon.SinonStub;

        before(async () => {
          await cachemap.set(key, value, { cacheHeaders, hash });
          if (args.name === "worker") return;
          const storeClient: StoreProxyTypes = get(cachemap, ["_store"]);
          const error = new Error(message);
          stub = sinon.stub(storeClient, "set").rejects(error);
        });

        after(() => {
          if (args.name === "worker") return;
          stub.restore();
        });

        it("then the method should return a rejected promise with the reason", async () => {
          let _key = key;
          let _message = message;

          if (args.name === "worker") {
            _key = "";
            _message = "Worker expected key to have a length greather than 0.";
          }

          try {
            await cachemap.has(_key, { deleteExpired: true, hash });
          } catch (error) {
            expect(error.message).to.equal(_message);
          }
        });
      });
    });

    describe("the set method", () => {
      let metadata: Metadata;

      after(async () => {
        await cachemap.clear();
      });

      context("when a key does not exist in the cachemap", () => {
        it("then the method should store the pair and add its metadata", async () => {
          await cachemap.set(key, value, { cacheHeaders, hash });

          if (usingMap) {
            expect(await cachemap.size()).to.eql(1);
          } else {
            expect(await cachemap.size()).to.eql(2);
          }

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

          if (usingMap) {
            expect(await cachemap.size()).to.eql(1);
          } else {
            expect(await cachemap.size()).to.eql(2);
          }

          expect(cachemap.metadata).lengthOf(1);
          const updatedMetadata = cachemap.metadata[0];
          expect(updatedMetadata.accessedCount).to.equal(0);
          expect(updatedMetadata.added).to.equal(metadata.added);
          expect(updatedMetadata.cacheability.metadata.ttl >= metadata.cacheability.metadata.ttl).to.equal(true);
          expect(updatedMetadata.key).to.equal(metadata.key);
          expect(updatedMetadata.lastAccessed).to.equal(metadata.lastAccessed);
          expect(updatedMetadata.lastUpdated >= metadata.lastUpdated).to.equal(true);
          expect(updatedMetadata.size).to.equal(metadata.size);
        });
      });

      context("when the database throws an exception", () => {
        const message = "Oops, there seems to be a problem";
        let stub: sinon.SinonStub;

        before(() => {
          if (args.name === "worker") return;
          const storeClient: StoreProxyTypes = get(cachemap, ["_store"]);
          const error = new Error(message);
          stub = sinon.stub(storeClient, "set").rejects(error);
        });

        after(() => {
          if (args.name === "worker") return;
          stub.restore();
        });

        it("then the method should return a rejected promise with the reason", async () => {
          let _key = key;
          let _message = message;

          if (args.name === "worker") {
            _key = "";
            _message = "Worker expected key to have a length greather than 0.";
          }

          try {
            await cachemap.set(_key, value, { cacheHeaders, hash });
          } catch (error) {
            expect(error.message).to.equal(_message);
          }
        });
      });
    });

    describe("the entries method", () => {
      before(async () => {
        const keys = Object.keys(testData);
        await Promise.all(keys.map((id) => cachemap.set(testData[id].url, testData[id].body, { cacheHeaders, hash })));
      });

      after(async () => {
        await cachemap.clear();
      });

      context("when no keys are passed into the method", () => {
        it("then the method should return all key/value pairs in the cachemap", async () => {
          const result = await cachemap.entries();
          expect(result).to.be.lengthOf(3);

          result.forEach((entry) => {
            expect(entry[0]).to.be.a("string");
            expect(entry[1]).to.be.a("object");
          });
        });
      });

      context("when keys are passed into the method", () => {
        it("then the method should return all the matching key/value pairs in the cachemap", async () => {
          const keys = cachemap.metadata.map((entry) => entry.key);
          const result = await cachemap.entries(keys.slice(0, 2));
          expect(result).to.be.lengthOf(2);

          result.forEach((entry) => {
            expect(entry[0]).to.be.a("string");
            expect(entry[1]).to.be.a("object");
          });
        });
      });
    });

    describe("the export method", () => {
      before(async () => {
        const keys = Object.keys(testData);
        const tags = ["alfa", "bravo", "charlie"];

        await Promise.all(keys.map((id) => {
          const tag = tags.pop();
          return cachemap.set(testData[id].url, testData[id].body, { cacheHeaders, hash, tag });
        }));
      });

      after(async () => {
        await cachemap.clear();
      });

      context("when no keys are passed into the method", () => {
        it("then the method should return all key/value pairs in the cachemap", async () => {
          const result = await cachemap.export();
          expect(result.entries).to.be.lengthOf(3);
          expect(result.metadata).to.be.lengthOf(3);
          expect(result.metadata[0].cacheability).to.be.instanceof(Cacheability);

          result.entries.forEach((entry) => {
            expect(entry[0]).to.be.a("string");
            expect(entry[1]).to.be.a("object");
          });
        });
      });

      context("when keys are passed into the method", () => {
        it("then the method should return all the matching key/value pairs in the cachemap", async () => {
          const keys = cachemap.metadata.map((entry) => entry.key);
          const result = await cachemap.export({ keys: keys.slice(0, 2) });
          expect(result.entries).to.be.lengthOf(2);
          expect(result.metadata).to.be.lengthOf(2);
          expect(result.metadata[0].cacheability).to.be.instanceof(Cacheability);

          result.entries.forEach((entry) => {
            expect(entry[0]).to.be.a("string");
            expect(entry[1]).to.be.a("object");
          });
        });
      });

      context("when a tag is passed into the method", () => {
        it("then the method should return all the matching key/value pairs in the cachemap", async () => {
          const result = await cachemap.export({ tag: "alfa" });
          expect(result.entries).to.be.lengthOf(1);
          expect(result.metadata).to.be.lengthOf(1);
          expect(result.metadata[0].cacheability).to.be.instanceof(Cacheability);

          result.entries.forEach((entry) => {
            expect(entry[0]).to.be.a("string");
            expect(entry[1]).to.be.a("object");
          });
        });
      });
    });

    describe("the import method", () => {
      let exportResult: ExportResult;

      before(async () => {
        const keys = Object.keys(testData);
        await Promise.all(keys.map((id) => cachemap.set(testData[id].url, testData[id].body, { cacheHeaders, hash })));
        exportResult = await cachemap.export();
        await cachemap.clear();
      });

      after(async () => {
        await cachemap.clear();
      });

      context("when a valid export object is passed into the method", () => {
        it("then the method should add the entries and metadata to the cachemap", async () => {
          if (usingMap) {
            expect(await cachemap.size()).to.eql(0);
          } else {
            expect(await cachemap.size()).to.eql(1);
          }

          expect(cachemap.metadata).to.be.lengthOf(0);
          await cachemap.import(exportResult);

          if (usingMap) {
            expect(await cachemap.size()).to.eql(3);
          } else {
            expect(await cachemap.size()).to.eql(4);
          }

          expect(cachemap.metadata).to.be.lengthOf(3);
        });
      });
    });
  });

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
  testCachemapClass(clientArgs);
  testCachemapClass(workerArgs);
} else {
  testCachemapClass(serverArgs);
  testCachemapClass(mapArgs);
}
