# cachemap

An extensible, isomorphic cache with modules to interface with Redis, LocalStorage, IndexedDB and an in-memory Map.

[![build-and-deploy](https://github.com/badbatch/cachemap/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/badbatch/cachemap/actions/workflows/build-and-deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Summary

* Use Redis or an in-memory Map on the server.
* Use LocalStorage, IndexedDB or an in-memory Map on the client.
* Extend with custom modules to interface with key/value databases of your choosing.
* Transfer entries from one Cachemap to another.
* Store entries alongside cache-control directives, etags and uuids.
* Cache-control directives used to derive whether entries are fresh or stale.
* Prioritize entries based on metadata stored against each entry.
* Use a reaper to cull stale entries at specified intervals.
* Set maximum memory size for total entries.
* Use on browser's main or worker thread.

## Installation

Cachemap is structured as a [monorepo](https://github.com/lerna/lerna), so each package is published to npm under the
`@cachemap` scope and can be installed in a project in the same way as any other npm package.

```bash
npm add @cachemap/<package>
```

So, for example, if you want a server cache that uses Redis you would install the packages below.

```bash
npm add @cachemap/core @cachemap/types @cachemap/redis
```

If, however, you want a persisted client cache that uses IndexedDB and culls stale data you would install the
following packages.

```bash
npm add @cachemap/core @cachemap/types @cachemap/indexed-db @cachemap/reaper
```

## Packages

The Cachemap's multi-package structure allows you to compose your cache of the modules you need, without additional
bloat. Start with the `@cachemap/core` package and build out from there.

* [@cachemap/utils](packages/utils/README.md)
* [@cachemap/controller](packages/controller/README.md)
* [@cachemap/core](packages/core/README.md)
* [@cachemap/core-worker](packages/core-worker/README.md)
* [@cachemap/indexed-db](packages/indexed-db/README.md)
* [@cachemap/local-storage](packages/local-storage/README.md)
* [@cachemap/map](packages/map/README.md)
* [@cachemap/reaper](packages/reaper/README.md)
* [@cachemap/redis](packages/redis/README.md)
* [@cachemap/types](packages/types/README.md)

## Usage

The Cachemap API is similar to that of a Map, it has `clear`, `delete`, `entries`, `get`, `has` and `set` methods,
as well as Cachemap specific `import`, `export` and `size` methods. Each module that interfaces with a database,
referred to as a store, also has these methods. The API provides a simple and consistent way to communicate with
key/value databases.

### Creating a Cachemap instance

The Cachemap is initialized using the traditional class constructor. Any modules you want to add to the Cachemap, like
the store to work with your database or the reaper to prune stale entries, are passed as properties to the constructor.

The default export of each module is a curried function that returns an async function that initializes the module.
This allows you and the Cachemap to pass configuration options into the module.

```typescript
import { Core } from "@cachemap/core";
import { init as indexedDB } from "@cachemap/indexed-db";
import { init as reaper } from "@cachemap/reaper";

const cachemap = new Core({
  name: "foobar",
  reaper: reaper({ interval: 300000 }),
  store: indexedDB(),
  type: "someType",
});
```

The example above initializes a persisted cache for the browser that uses IndexedDB as its database and checks for
stale entries every five minutes. No other configuration is required, as long as the browser supports IndexedDB you are
good to go.

### Checking, getting, setting, deleting

The bread and butter of the Cachemap's functionality are the `delete`, `get`, `has`, and `set` methods. The input
signatures of the first three are very similar, each excepts a key as the first argument and a set of options as the
second. The `set` method, meanwhile, excepts a key as the first argument, a value as the second and the third is the
options.

An important `set` option is `cacheHeaders`. This takes a Headers instance or a plain object of HTTP headers. The etag
and cache-control directives are filtered out and stored against an entry. The directives are used to generate a
TTL (time to live) that the Cachemap checks whenever accessing the entry.

Another important `set` option is `tag`. This allows you to store an arbitrary identifier against an entry, like a
request or session ID. These identifiers can come in handy, for example, if you want to export all entries added during
a particular request.

All four methods have a `hash` option that runs the key through `md5` to create a short unique string, which can be
useful if the original keys are long strings such as URLs or GraphQL queries.

```typescript
(async () => {
  const key = "https://api.example.com/user/foobar";
  const value = { email: "foobar@example.com", id: "12345", name: "foobar" };
  const cacheHeaders = { cacheControl: "private, max-age=60" };

  await cachemap.set(key, value, { cacheHeaders, hash: true });
  // returns undefined

  const cacheability = await cachemap.has(key, { hash: true });
  // returns an instance of the Cacheability module, which includes the
  // cache-control directives and the TTL calculated from the directives

  const entry = await cachemap.get(key, { hash: true });
  // returns { email: "foobar@example.com", id: "12345", name: "foobar" }

  const deleted = await cachemap.delete(key, { hash: true });
  // returns true
})();
```

### Bulk operations

Sometimes you might want to add or retrieve multiple entries at once, and this is where the `import` and `export`
methods come in. They allow you to bulk transfer entries and their metadata between two Cachemaps. You can export
all entries or a subset based on specific keys or a particular tag.

This could be used to pass entries between a Cachemap on the server and one on the browser. The server Cachemap could,
for example, export all entries and metadata added during a request to the server, then this could be serialized and
embedded in the response body, from where it could be imported into the browser Cachemap.

```typescript
(async () => {
  const requestID = "6d91e84e-b14c-11e8-96f8-529269fb1459";

  const entries = await cachemapOne.export({ tag: requestID });
  // returns { entries: Array<[string, any]>, metadata: Array<{ [key: string]: any }> }

  await cachemapTwo.import(entries);
  // returns undefined
})();
```

### Web worker

To free up the browser's main thread you can run the Cachemap in a web worker. For this you need the
`@cachemap/core-worker` package in addition to `@cachemap/core`, a store and optional reaper package.

The package exports the `CoreWorker` class that you initialize on the main thread and the `registerWorker` method to
use in your `worker.js` file. The `CoreWorker` class method signatures are identical to those of the `Core` class.

```typescript
// main.js
import { CoreWorker } from "@cachemap/core-worker";

const cachemap = new CoreWorker({
  name: "integration-tests",
  worker: new Worker("worker.js"),
  type: "someType",
});
```

```typescript
// worker.js
import { Core } from "@cachemap/core";
import { registerWorker } from "@cachemap/core-worker";
import { init as indexedDB } from "@cachemap/indexed-db";
import { init as reaper } from "@cachemap/reaper";

const cachemap = new Core({
  name: "worker-integration-tests",
  reaper: reaper({ interval: 300000 }),
  store: indexedDB(),
  type: "someType",
});

registerWorker({ cachemap });
```

The example above initializes a persisted browser cache that runs on the worker thread and uses the IndexedDB and
reaper modules.

### Taking actions when entries are deleted

Each Cachemap has its own event emitter on the `emitter` property, which can be used to listen to events such as the
`"ENTRY_DELTED"` event. This is emitted whenever an entry is deleted by the reaper. The data passed to the listener
includes the entry `key`, any `tags` associated with the entry and whether it was successfully `deleted`.

```typescript
const cachemap = new Core({
  name: "worker-integration-tests",
  reaper: reaper({ interval: 300000 }),
  store: indexedDB(),
  type: "someType",
});

cachemap.emitter.on(cachemap.events.ENTRY_DELETED, data => {
  // DO SOMETHING
});
```

### Controlling multiple instances

Sometimes you'll want to control multiple Cachemap instances that are not directly accessible. You can do this through
the `@cachemap/controller` package. The package exports an eventemitter-based module that has methods for clearing
instances caches and starting/stopping each instance's reaper module.

Each Cachemap instance is listening for these events and will action them if the `name` or `type` props passed into the
method match the instance's.

```typescript
import { instance } from "@cachewmap/controller";

instance.clearCaches({ type: "someType" });
instance.stopReapers({ type: "someType" });
```

### Custom modules

The Cachemap comes with four store modules, but you can create additional stores to work with key/value databases of
your choosing. A store just has to adhere to the structure below. If you are writing in Typescript, you can even
import the `Store` interface from `@cachemap/core` and have your store class implement that.

```typescript
// store class must implement this interface
interface Store {
  readonly maxHeapSize: number;
  readonly name: string;
  readonly type: string;
  clear(): Promise<void>;
  delete(key: string): Promise<boolean>;
  entries(keys?: string[]): Promise<Array<[string, any]>>;
  get(key: string): Promise<any>;
  has(key: string): Promise<boolean>;
  import(entries: Array<[string, any]>): Promise<void>;
  set(key: string, value: any): Promise<void>;
  size(): Promise<number>;
}

// async function must return store instance
type StoreInit = (options: { name: string }) => Promise<Store>;
```

## Changelog

Check out the [features, fixes and more](CHANGELOG.md) that go into each major, minor and patch version.

## License

Cachemap is [MIT Licensed](LICENSE).
