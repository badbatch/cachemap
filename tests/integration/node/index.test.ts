import Core from "@cachemap/core";
import redis, { RedisStore } from "@cachemap/redis";
import Cacheability from "cacheability";
import { expect } from "chai";
import { get } from "lodash";
import md5 from "md5";
import sinon from "sinon";
import { testData } from "../../data";
import { PlainObject } from "../../defs";

describe("Creating an instance of the cachemap", () => {
  let cachemap: Core;

  before(async () => {
    cachemap = await Core.init({
      name: "node-integration-tests",
      store: redis({ mock: true }),
    });
  });

  it("The init method should return an instance of the Cachemap class", async () => {
    expect(cachemap).to.be.instanceof(Core);
  });

  it("The Cachemap instance store type should be 'redis'", async () => {
    expect(cachemap.storeType).to.equal("redis");
  });
});

describe("Adding an entry into the cachemap", () => {
  const ID = "136-7317";
  const key: string = testData[ID].url;
  const value: PlainObject = testData[ID].body;
  const cacheHeaders: PlainObject = { cacheControl: "public, max-age=1" };
  let cachemap: Core;

  before(async () => {
    cachemap = await Core.init({
      name: "node-integration-tests",
      store: redis({ mock: true }),
    });
  });

  context("When a matching entry does not exist", () => {
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
    });

    it("The set method should store the key/value pair", async () => {
      expect(await cachemap.size()).to.equal(2);
      expect(await cachemap.get(key, { hash: true })).to.deep.equal(value);
    });
  });

  context("When a matching entry does exist", () => {
    before(async () => {
      await cachemap.set(key, { ...value, index: 0 }, { cacheHeaders, hash: true });
      await cachemap.set(key, { ...value, index: 1 }, { cacheHeaders, hash: true });
    });

    after(async () => {
      await cachemap.clear();
    });

    it("The set method should update the existing entry's metadata", async () => {
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

    it("The set method should overwrite the existing entry's key/value pair", async () => {
      expect(await cachemap.size()).to.equal(2);
      expect(await cachemap.get(key, { hash: true })).to.deep.equal({ ...value, index: 1 });
    });
  });

  context("When the same key is added twice in quick succession", () => {
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
      expect(await cachemap.size()).to.equal(2);
      expect(await cachemap.get(key, { hash: true })).to.deep.equal({ ...value, index: 1 });
    });
  });

  context("When the store throws an exception", () => {
    const message = "Oops, there seems to be a problem";
    let stub: sinon.SinonStub;

    before(async () => {
      const redisStore: RedisStore = get(cachemap, ["_store"]);
      const error = new Error(message);
      stub = sinon.stub(redisStore, "set").rejects(error);
    });

    after(async () => {
      stub.restore();
      await cachemap.clear();
    });

    it("The set method should return a rejected promise with the reason", async () => {
      try {
        await cachemap.set(key, value, { cacheHeaders, hash: true });
      } catch (error) {
        expect(error.message).to.equal(message);
      }
    });
  });
});

describe("Removing an entry from the cachemap", () => {
  const ID = "136-7317";
  const key: string = testData[ID].url;
  const value: PlainObject = testData[ID].body;
  const cacheHeaders: PlainObject = { cacheControl: "public, max-age=1" };
  let cachemap: Core;

  before(async () => {
    cachemap = await Core.init({
      name: "node-integration-tests",
      store: redis({ mock: true }),
    });
  });

  context("When a matching entry does not exist", () => {
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

  context("When a matching entry does exist", () => {
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
      expect(await cachemap.size()).to.equal(1);
      expect(await cachemap.get(key, { hash: true })).to.equal(undefined);
    });
  });

  context("When the store throws an exception", () => {
    const message = "Oops, there seems to be a problem";
    let stub: sinon.SinonStub;

    before(async () => {
      await cachemap.set(key, value, { cacheHeaders, hash: true });
      const redisStore: RedisStore = get(cachemap, ["_store"]);
      const error = new Error(message);
      stub = sinon.stub(redisStore, "delete").rejects(error);
    });

    after(async () => {
      stub.restore();
      await cachemap.clear();
    });

    it("The delete method should return a rejected promise with the reason", async () => {
      try {
        await cachemap.delete(key, { hash: true });
      } catch (error) {
        expect(error.message).to.equal(message);
      }
    });
  });
});
