import Core from "@cachemap/core";
import indexedDB from "@cachemap/indexed-db";
import localStorage from "@cachemap/local-storage";
import { expect } from "chai";

function testWeb(store, storeType): void {
  describe(`When store type is ${storeType}`, () => {
    describe("Creating an instance of the cachemap", () => {
      let cachemap: Core;

      before(async () => {
        cachemap = await Core.init({
          name: "web-integration-tests",
          store: store(),
        });
      });

      it("The init method should return an instance of the Cachemap class", async () => {
        expect(cachemap).to.be.instanceof(Core);
      });

      it(`The Cachemap instance store type should be '${storeType}'`, async () => {
        expect(cachemap.storeType).to.equal(storeType);
      });
    });
  });
}

testWeb(indexedDB, "indexedDB");
testWeb(localStorage, "localStorage");
