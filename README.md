# cachemap

An extensible, isomorphic cache with interfaces for Redis, LocalStorage, IndexedDB and an in-memory Map.

[![Build Status](https://travis-ci.org/bad-batch/cachemap.svg?branch=master)](https://travis-ci.org/bad-batch/cachemap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://badge.fury.io/js/cachemap.svg)](https://badge.fury.io/js/cachemap)
[![dependencies Status](https://david-dm.org/bad-batch/cachemap/status.svg)](https://david-dm.org/bad-batch/cachemap)
[![devDependencies Status](https://david-dm.org/bad-batch/cachemap/dev-status.svg)](https://david-dm.org/bad-batch/cachemap?type=dev)

## Summary

* Use Redis or an in-memory Map on the server.
* Use LocalStorage, IndexedDB or an in-memory Map on the client.
* Extend with custom interfaces to work with key/value databases of your choosing.
* Import/export entries and their metadata from one Cachemap to another.
* Store entries alongside cache-control directives, etags and uuids.
* Cache-control directives used to derive whether entries are fresh or stale.
* Prioritise entries based on metadata.
* Use a reaper to cull stale entries at specified intervals.
* Set maximum memory size for total entries.
* Use on browser's main or worker thread.

## Installation

Cachemap is structured as a [monorepo](https://github.com/lerna/lerna), so each package is published to npm under the
`@cachemap` scope and can be installed in a project in the same way as any other npm package.

```bash
yarn add @cachemap/<package>
```

So, for example, if you want a server cache that uses Redis you would install the packages below.

```bash
yarn add @cachemap/core @cachemap/redis
```

If, however, you want a persisted client cache that uses IndexedDB and culls stale data you would install the
following packages.

```bash
yarn add @cachemap/core @cachemap/indexed-db @cachemap/reaper
```

## Packages

Cachemap's multi-package structure allows you to compose your cache of the features you need, without additional
bloat. Start with the `@cachemap/core` package and build out from there.

* [@cachemap/core](packages/core/README.md)
* [@cachemap/core-worker](packages/core-worker/README.md)
* [@cachemap/indexed-db](packages/indexed-db/README.md)
* [@cachemap/local-storage](packages/local-storage/README.md)
* [@cachemap/map](packages/map/README.md)
* [@cachemap/reaper](packages/reaper/README.md)
* [@cachemap/redis](packages/redis/README.md)

## Usage

The Cachemap API is similar to that of a Map, it has `clear`, `delete`, `entries`, `get`, `has` and `set` methods,
as well as Cachemap specific `import`, `export` and `size` methods. All methods are asynchronous. The API provides a
consistent interface for communicating with key/value databases.

## Custom interfaces

The Cachemap has 'stores' to work with Redis, IndexedDB, LocalStorage and a in-memory Map, but you can create a
custom one to work with a key/value database of your choosing, as long as the 'store' you create adheres to the
structure below.

```typescript
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

type StoreInit = (options: { name: string }) => Promise<Store>;
```

## Changelog

Check out the [features, fixes and more](CHANGELOG.md) that go into each major, minor and patch version.

## License

Cachemap is [MIT Licensed](LICENSE).
