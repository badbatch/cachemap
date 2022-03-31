import Core, { ExportResult } from "@cachemap/core";
import CoreWorker from "@cachemap/core-worker";
import reaper from "@cachemap/reaper";
import { Metadata, StoreInit } from "@cachemap/types";
import Cacheability from "cacheability";
import { expect } from "chai";
import md5 from "md5";
import { testData } from "../../data";
import { PlainObject, RunOptions } from "../../defs";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function run(
  { cachemapSize, init, worker }: RunOptions,
  storeType: string,
  store?: (options: any) => StoreInit,
  storeOptions: PlainObject = {},
): void {
  describe(`When store type is ${storeType}`, () => {
    describe("Adding an entry into the cachemap", () => {
      const ID = "136-7317";
      const key: string = testData[ID].url;
      const value: PlainObject = testData[ID].body;
      const cacheHeaders: PlainObject = { cacheControl: "public, max-age=1" };
      let cachemap: Core | CoreWorker;

      before(() => {
        cachemap = init({
          name: `${storeType}-integration-tests`,
          store: store && store(storeOptions),
          type: "integration-tests",
          worker,
        });
      });

      describe("When a matching entry does not exist", () => {
        before(async () => {
          await cachemap.set(key, value, { cacheHeaders, hash: true });
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The set method should store the entry metadata", async () => {
          expect(cachemap.metadata).lengthOf(1);
          const metadata = cachemap.metadata[0];
          expect(metadata.accessedCount).to.equal(0);
          expect(metadata.added).to.be.a("number");
          expect(metadata.cacheability).to.be.instanceOf(Cacheability);
          expect(metadata.key).to.equal(md5(key));
          expect(metadata.lastAccessed).to.be.a("number");
          expect(metadata.lastUpdated).to.be.a("number");
          expect(metadata.size).to.be.a("number");
          expect(metadata.updatedCount).to.equal(0);
        });

        it("The set method should store the key/value pair", async () => {
          expect(await cachemap.size()).to.equal(cachemapSize(2));
          expect(await cachemap.get(key, { hash: true })).to.deep.equal(value);
        });
      });

      describe("When a matching entry does exist", () => {
        let metadata: Metadata;

        before(async () => {
          await cachemap.set(key, { ...value, index: 0 }, { cacheHeaders, hash: true });
          metadata = { ...cachemap.metadata[0] };
          await cachemap.set(key, { ...value, index: 1 }, { cacheHeaders, hash: true });
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The set method should update the existing entry's metadata", async () => {
          expect(cachemap.metadata).lengthOf(1);
          const updatedMetadata = cachemap.metadata[0];
          expect(updatedMetadata.accessedCount).to.equal(0);
          expect(updatedMetadata.added).to.equal(metadata.added);
          expect(updatedMetadata.cacheability.metadata.ttl >= metadata.cacheability.metadata.ttl).to.equal(true);
          expect(updatedMetadata.key).to.equal(metadata.key);
          expect(updatedMetadata.lastAccessed).to.equal(metadata.lastAccessed);
          expect(updatedMetadata.lastUpdated >= metadata.lastUpdated).to.equal(true);
          expect(updatedMetadata.size).to.equal(metadata.size);
          expect(updatedMetadata.updatedCount).to.equal(1);
        });

        it("The set method should overwrite the existing entry's key/value pair", async () => {
          expect(await cachemap.size()).to.equal(cachemapSize(2));
          expect(await cachemap.get(key, { hash: true })).to.deep.equal({ ...value, index: 1 });
        });
      });

      describe("When the same key is added twice in quick succession", () => {
        before(async () => {
          await Promise.all([
            cachemap.set(key, { ...value, index: 0 }, { cacheHeaders, hash: true }),
            cachemap.set(key, { ...value, index: 1 }, { cacheHeaders, hash: true }),
          ]);
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The set method should store the first entry's metadata and then update it", async () => {
          expect(cachemap.metadata).lengthOf(1);
          const metadata = cachemap.metadata[0];
          expect(metadata.accessedCount).to.equal(0);
          expect(metadata.added).to.be.a("number");
          expect(metadata.cacheability).to.be.instanceOf(Cacheability);
          expect(metadata.key).to.equal(md5(key));
          expect(metadata.lastAccessed).to.be.a("number");
          expect(metadata.lastUpdated).to.be.a("number");
          expect(metadata.size).to.be.a("number");
          expect(metadata.updatedCount).to.equal(1);
        });

        it("The set method should overwrite the first entry's key/value pair with the subsequent entry's", async () => {
          expect(await cachemap.size()).to.equal(cachemapSize(2));
          expect(await cachemap.get(key, { hash: true })).to.deep.equal({ ...value, index: 1 });
        });
      });
    });

    describe("Removing an entry from the cachemap", () => {
      const ID = "136-7317";
      const key: string = testData[ID].url;
      const value: PlainObject = testData[ID].body;
      const cacheHeaders: PlainObject = { cacheControl: "public, max-age=1" };
      let cachemap: Core | CoreWorker;

      before(() => {
        cachemap = init({
          name: `${storeType}-integration-tests`,
          store: store && store(storeOptions),
          type: "integration-tests",
          worker,
        });
      });

      describe("When a matching entry does not exist", () => {
        let deleted: boolean;

        before(async () => {
          deleted = await cachemap.delete(key, { hash: true });
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The delete method should return false", async () => {
          expect(deleted).to.equal(false);
        });
      });

      describe("When a matching entry does exist", () => {
        let deleted: boolean;

        before(async () => {
          await cachemap.set(key, value, { cacheHeaders, hash: true });
          deleted = await cachemap.delete(key, { hash: true });
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The delete method should return true", async () => {
          expect(deleted).to.equal(true);
        });

        it("The delete method should remove the entry metadata", async () => {
          expect(cachemap.metadata).lengthOf(0);
        });

        it("The delete method should remove the key/value pair", async () => {
          expect(await cachemap.size()).to.equal(cachemapSize(1));
          expect(await cachemap.get(key, { hash: true })).to.equal(undefined);
        });
      });
    });

    describe("Retrieving an entry from the cachemap", () => {
      const ID = "136-7317";
      const key: string = testData[ID].url;
      const value: PlainObject = testData[ID].body;
      const cacheHeaders: PlainObject = { cacheControl: "public, max-age=1" };
      let cachemap: Core | CoreWorker;

      before(() => {
        cachemap = init({
          name: `${storeType}-integration-tests`,
          store: store && store(storeOptions),
          type: "integration-tests",
          worker,
        });
      });

      describe("When a matching entry does not exist", () => {
        let entry;

        before(async () => {
          entry = await cachemap.get(key, { hash: true });
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The get method should return undefined", async () => {
          expect(entry).to.equal(undefined);
        });
      });

      describe("When a matching entry exists", () => {
        let metadata: Metadata;
        let entry;

        before(async () => {
          await cachemap.set(key, value, { cacheHeaders, hash: true });
          metadata = { ...cachemap.metadata[0] };
          entry = await cachemap.get(key, { hash: true });
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The get method should return the entry value", async () => {
          expect(entry).to.deep.equal(value);
        });

        it("The get method should update the existing entry's metadata", async () => {
          expect(cachemap.metadata).lengthOf(1);
          const updatedMetadata = cachemap.metadata[0];
          expect(updatedMetadata.accessedCount).to.equal(1);
          expect(updatedMetadata.added).to.equal(metadata.added);
          expect(updatedMetadata.cacheability).to.be.instanceOf(Cacheability);
          expect(updatedMetadata.key).to.equal(md5(key));
          expect(updatedMetadata.lastAccessed >= metadata.lastAccessed).to.equal(true);
          expect(updatedMetadata.lastUpdated).to.equal(metadata.lastUpdated);
          expect(updatedMetadata.size).to.equal(metadata.size);
          expect(updatedMetadata.updatedCount).to.equal(0);
        });
      });
    });

    describe("Checking if the cachemap has an entry", () => {
      const ID = "136-7317";
      const key: string = testData[ID].url;
      const value: PlainObject = testData[ID].body;
      const cacheHeaders: PlainObject = { cacheControl: "public, max-age=1" };
      let cachemap: Core | CoreWorker;

      before(() => {
        cachemap = init({
          name: `${storeType}-integration-tests`,
          store: store && store(storeOptions),
          type: "integration-tests",
          worker,
        });
      });

      describe("When a matching entry does not exist", () => {
        let exists: boolean | Cacheability;

        before(async () => {
          exists = await cachemap.has(key, { hash: true });
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The has method should return false", async () => {
          expect(exists).to.equal(false);
        });
      });

      describe("When a matching entry exists", () => {
        describe("When the extry's cacheability is valid", () => {
          let exists: boolean | Cacheability;

          before(async () => {
            await cachemap.set(key, value, { cacheHeaders, hash: true });
            exists = await cachemap.has(key, { hash: true });
          });

          after(async () => {
            await cachemap.clear();
          });

          it("The has method should return the entry's Cacheability instance", async () => {
            expect(exists).to.be.instanceOf(Cacheability);
          });
        });

        describe("When the entry's cacheability is expired", () => {
          describe("When deleteExpired is not passed in as an option", () => {
            let exists: boolean | Cacheability;

            before(async () => {
              await cachemap.set(key, value, { cacheHeaders, hash: true });
              await delay(1000);
              exists = await cachemap.has(key, { hash: true });
            });

            after(async () => {
              await cachemap.clear();
            });

            it("The has method should return the entry's Cacheability instance", async () => {
              expect(exists).to.be.instanceOf(Cacheability);
            });

            it("The has method should not remove the entry metadata", async () => {
              expect(cachemap.metadata).lengthOf(1);
            });

            it("The has method should not remove the key/value pair", async () => {
              expect(await cachemap.size()).to.equal(cachemapSize(2));
              expect(await cachemap.get(key, { hash: true })).to.deep.equal(value);
            });
          });

          describe("When deleteExpired is passed in as an option", () => {
            let exists: boolean | Cacheability;

            before(async () => {
              await cachemap.set(key, value, { cacheHeaders, hash: true });
              await delay(1000);
              exists = await cachemap.has(key, { deleteExpired: true, hash: true });
            });

            after(async () => {
              await cachemap.clear();
            });

            it("The has method should return false", async () => {
              expect(exists).to.equal(false);
            });

            it("The has method should remove the entry metadata", async () => {
              expect(cachemap.metadata).lengthOf(0);
            });

            it("The has method should remove the key/value pair", async () => {
              expect(await cachemap.size()).to.equal(cachemapSize(1));
              expect(await cachemap.get(key, { hash: true })).to.equal(undefined);
            });
          });
        });
      });
    });

    describe("Retrieving multiple entries from the cachemap", () => {
      const cacheHeaders: PlainObject = { cacheControl: "public, max-age=1" };
      let cachemap: Core | CoreWorker;

      before(() => {
        cachemap = init({
          name: `${storeType}-integration-tests`,
          store: store && store(storeOptions),
          type: "integration-tests",
          worker,
        });
      });

      describe("When no keys are passed in", () => {
        let result: [string, any][];

        before(async () => {
          const keys = Object.keys(testData);

          await Promise.all(
            keys.map(id => {
              return cachemap.set(testData[id].url, testData[id].body, { cacheHeaders, hash: true });
            }),
          );

          result = await cachemap.entries();
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The entries method should return all the key/value pair entries", () => {
          expect(result).to.be.lengthOf(3);
        });
      });

      describe("When keys are passed in", () => {
        let result: [string, any][];

        before(async () => {
          const ids = Object.keys(testData);
          const hashedKeys: string[] = [];

          await Promise.all(
            ids.map(id => {
              const url = testData[id].url;
              hashedKeys.push(md5(url));
              return cachemap.set(url, testData[id].body, { cacheHeaders, hash: true });
            }),
          );

          result = await cachemap.entries(hashedKeys.slice(0, 2));
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The entries method should return the matching key/value pair entries", async () => {
          expect(result).to.be.lengthOf(2);
        });
      });
    });

    describe("Retrieving multiple entries and their metadata from the cachemap", () => {
      const cacheHeaders: PlainObject = { cacheControl: "public, max-age=1" };
      let cachemap: Core | CoreWorker;

      before(() => {
        cachemap = init({
          name: `${storeType}-integration-tests`,
          store: store && store(storeOptions),
          type: "integration-tests",
          worker,
        });
      });

      describe("When no keys are passed in", () => {
        let result: ExportResult;

        before(async () => {
          const keys = Object.keys(testData);

          await Promise.all(
            keys.map(id => {
              return cachemap.set(testData[id].url, testData[id].body, { cacheHeaders, hash: true });
            }),
          );

          result = await cachemap.export();
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The export method should return all the key/value pair entries and their metadata", () => {
          expect(result.entries).to.be.lengthOf(3);
          expect(result.metadata).to.be.lengthOf(3);
        });
      });

      describe("When keys are passed in", () => {
        let result: ExportResult;

        before(async () => {
          const ids = Object.keys(testData);
          const hashedKeys: string[] = [];

          await Promise.all(
            ids.map(id => {
              const url = testData[id].url;
              hashedKeys.push(md5(url));
              return cachemap.set(url, testData[id].body, { cacheHeaders, hash: true });
            }),
          );

          result = await cachemap.export({ keys: hashedKeys.slice(0, 2) });
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The export method should return the matching key/value pair entries and their metadata", async () => {
          expect(result.entries).to.be.lengthOf(2);
          expect(result.metadata).to.be.lengthOf(2);
        });
      });

      describe("When a tag is passed in", () => {
        let result: ExportResult;

        before(async () => {
          const keys = Object.keys(testData);
          const tags = ["alfa", "bravo", "charlie"];

          await Promise.all(
            keys.map(id => {
              const tag = tags.pop();
              return cachemap.set(testData[id].url, testData[id].body, { cacheHeaders, hash: true, tag });
            }),
          );

          result = await cachemap.export({ tag: "alfa" });
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The export method should return the matching key/value pair entries and their metadata", async () => {
          expect(result.entries).to.be.lengthOf(1);
          expect(result.metadata).to.be.lengthOf(1);
        });
      });

      describe("When filterByValue is passed in", () => {
        let result: ExportResult;

        before(async () => {
          const keys = Object.keys(testData);

          await Promise.all(
            keys.map(id => {
              return cachemap.set(testData[id].url, testData[id].body, { cacheHeaders, hash: true });
            }),
          );

          // @ts-ignore
          result = await cachemap.export({ filterByValue: { comparator: "180-1387", keyChain: "id" } });
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The export method should return the matching key/value pair entries and their metadata", async () => {
          expect(result.entries).to.be.lengthOf(1);
          expect(result.metadata).to.be.lengthOf(1);
        });
      });
    });

    describe("Adding multiple entries and their metadata to the cachemap", () => {
      const cacheHeaders: PlainObject = { cacheControl: "public, max-age=1" };
      let cachemap: Core | CoreWorker;

      before(() => {
        cachemap = init({
          name: `${storeType}-integration-tests`,
          store: store && store(storeOptions),
          type: "integration-tests",
          worker,
        });
      });

      describe("When no matching entries exist", () => {
        before(async () => {
          const keys = Object.keys(testData);

          await Promise.all(
            keys.map(id => {
              return cachemap.set(testData[id].url, testData[id].body, { cacheHeaders, hash: true });
            }),
          );

          const exported = await cachemap.export();
          await cachemap.clear();
          await cachemap.import(exported);
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The import method should add the key/value pair entries and their metadata", async () => {
          expect(await cachemap.size()).to.equal(cachemapSize(4));
          expect(cachemap.metadata).to.be.lengthOf(3);
        });
      });

      describe("When matching entries exist", () => {
        before(async () => {
          const keys = Object.keys(testData);

          await Promise.all(
            keys.map(id => {
              return cachemap.set(testData[id].url, testData[id].body, { cacheHeaders, hash: true });
            }),
          );

          const exported = await cachemap.export();
          await cachemap.import(exported);
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The import method should overwrite the matching key/value pair entries and their metadata", async () => {
          expect(await cachemap.size()).to.equal(cachemapSize(4));
          expect(cachemap.metadata).to.be.lengthOf(3);
        });
      });
    });

    if (worker) return;

    describe("When the reaper module is passed into the cachemap", () => {
      const ID = "136-7317";
      const key: string = testData[ID].url;
      const value: PlainObject = testData[ID].body;
      const cacheHeaders: PlainObject = { cacheControl: "public, max-age=0" };
      let cachemap: Core | CoreWorker;

      describe("When an entry's cacheability expires", () => {
        let entryDeletedData: PlainObject;

        before(async () => {
          cachemap = init({
            name: `${storeType}-integration-tests`,
            reaper: reaper({ interval: 500, start: true }),
            store: store && store(storeOptions),
            type: "integration-tests",
          });

          cachemap.emitter.on(cachemap.events.ENTRY_DELETED, data => {
            entryDeletedData = data;
          });

          await cachemap.set(key, value, { cacheHeaders, hash: true, tag: "ALPHA" });
          await delay(1000);
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The reaper should remove the key/value pair", async () => {
          expect(await cachemap.size()).to.equal(cachemapSize(1));
          expect(await cachemap.get(key, { hash: true })).to.equal(undefined);
        });

        it("The reaper should remove the entry metadata", async () => {
          expect(cachemap.metadata).lengthOf(0);
        });

        it("The ENTRY_DELETED event should be emitted with the correct data", () => {
          expect(entryDeletedData.key).to.be.a("string");
          expect(entryDeletedData.deleted).to.equal(true);
          expect(entryDeletedData.tags).to.eql(["ALPHA"]);
        });
      });

      describe("When the entries exceed the max heap size", () => {
        const entryDeletedData: PlainObject[] = [];
        let keys: string[];

        before(async () => {
          cachemap = init({
            maxHeapSize: 100,
            name: `${storeType}-integration-tests`,
            reaper: reaper({ start: true }),
            store: store && store({ ...storeOptions, maxHeapSize: 100 }),
            type: "integration-tests",
          });

          cachemap.emitter.on(cachemap.events.ENTRY_DELETED, data => {
            entryDeletedData.push(data);
          });

          keys = Object.keys(testData);

          await Promise.all(
            keys.map(id => {
              return cachemap.set(testData[id].url, testData[id].body, { cacheHeaders, hash: true });
            }),
          );
        });

        after(async () => {
          await cachemap.clear();
        });

        it("The reaper should remove the necessary key/value pair", async () => {
          expect(await cachemap.size()).to.equal(cachemapSize(3));
          expect(await cachemap.get(key[2], { hash: true })).to.equal(undefined);
        });

        it("The reaper should remove the entry metadata", async () => {
          expect(cachemap.metadata).lengthOf(2);
        });

        it("The ENTRY_DELETED event should be emitted with the correct data", () => {
          expect(entryDeletedData).to.have.length(1);
          expect(entryDeletedData[0].key).to.be.a("string");
          expect(entryDeletedData[0].deleted).to.equal(true);
          expect(entryDeletedData[0].tags).to.eql([]);
        });
      });
    });
  });
}
