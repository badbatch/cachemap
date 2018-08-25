import Core from "@cachemap/core";
import indexedDB from "@cachemap/indexed-db";
import { expect } from "chai";

describe("Creating an instance of the cachemap", () => {
  let cachemap: Core;

  before(async () => {
    cachemap = await Core.init({
      name: "web-integration-tests",
      store: indexedDB(),
    });
  });

  it("The init method should return an instance of the Cachemap class", async () => {
    expect(cachemap).to.be.instanceof(Core);
  });

  it("The Cachemap instance store type should be 'indexedDB'", async () => {
    expect(cachemap.storeType).to.equal("indexedDB");
  });
});
