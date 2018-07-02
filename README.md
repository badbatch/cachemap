# cachemap

An isomorphic cache that can use Redis, LocalStorage, IndexedDB or an in-memory Map.

[![Build Status](https://travis-ci.org/bad-batch/cachemap.svg?branch=master)](https://travis-ci.org/bad-batch/cachemap)
[![codecov](https://codecov.io/gh/bad-batch/cachemap/branch/master/graph/badge.svg)](https://codecov.io/gh/bad-batch/cachemap)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=sonarqube%3Acachemap&metric=alert_status)](https://sonarcloud.io/dashboard?id=sonarqube%3Acachemap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://badge.fury.io/js/cachemap.svg)](https://badge.fury.io/js/cachemap)
[![dependencies Status](https://david-dm.org/bad-batch/cachemap/status.svg)](https://david-dm.org/bad-batch/cachemap)
[![devDependencies Status](https://david-dm.org/bad-batch/cachemap/dev-status.svg)](https://david-dm.org/bad-batch/cachemap?type=dev)

## Summary

* Use Redis or an in-memory Map on the server.
* Use LocalStorage, IndexedDB or an in-memory Map on the client.
* Export/import entries and metadata from one Cachemap to another.
* Store data alongside cache-control directives, etag and uuid (tag).
* Cache headers used to derive whether data is fresh or stale.
* Sort stored data based on metadata values.
* Build-in reaper to cull stale data at specified intervals.
* Set approximate maximum memory size for data.
* Use on main thread or as web worker in browser.

## Installation

```bash
yarn add cachemap
```

## Compilation

The `WEB_ENV` environment variable must be set to `'true'` when you compile your browser bundle in order to exclude
Redis from the build.

## Documentation

Additional documentation can be found on the Cachemap [github pages](https://bad-batch.github.io/cachemap).

## Web worker interface

You can run Cachemap in a web worker by using `WorkerCachemap` as the Cachemap interface in your bundle on the main
thread and `{ worker-cachemap.worker: ./node_modules/cachemap/lib/browser/worker.js }` as the entry point for your
bundle on the worker thread.

## Changelog

Check out the [features, fixes and more](CHANGELOG.md) that go into each major, minor and patch version.

## License

Cachemap is [MIT Licensed](LICENSE).