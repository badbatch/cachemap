import Core from "@cachemap/core";
import redis from "@cachemap/redis";
import { expect } from "chai";

describe("Creating an instance of the cachemap", () => {
  let cachemap: Core;

  context("when the store is redis", () => {
    before(async () => {
      cachemap = await Core.init({
        name: "node-integration-tests",
        store: redis({ mock: true }),
      });
    });

    it("the method should return an instance of the Cachemap class", async () => {
      expect(cachemap).to.be.instanceof(Core);
    });

    it("The Cachemap instance store type should be 'redis'", async () => {
      expect(cachemap.storeType).to.equal("redis");
    });
  });
});
