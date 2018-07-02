import { CachemapArgs, ObjectMap } from "../types";

export const clientArgs: CachemapArgs = {
  name: "client",
  use: { client: "localStorage" },
};

export const workerArgs: CachemapArgs = {
  indexedDBOptions: {
    databaseName: "alfa-database",
    objectStoreName: "alfa",
  },
  name: "worker",
  use: { client: "indexedDB" },
};

export const serverArgs: CachemapArgs = {
  mockRedis: true,
  name: "server",
  use: { server: "redis" },
};

export const mapArgs: CachemapArgs = {
  name: "map",
  use: { server: "map" },
};

export const testData: ObjectMap = {
  "136-7317": {
    body: { id: "136-7317"},
    url: "https://www.tesco.com/direct/rest/content/catalog/product/136-7317",
  },
  "180-1387": {
    body: { id: "180-1387"},
    url: "https://www.tesco.com/direct/rest/content/catalog/product/180-1387",
  },
  "183-3905": {
    body: { id: "183-3905"},
    url: "https://www.tesco.com/direct/rest/content/catalog/product/183-3905",
  },
};
