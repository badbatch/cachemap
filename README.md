# cachemap
An isomorphic cache that can use Redis, LocalStorage, IndexedDB or an in-memory Map.

[![Build Status](https://travis-ci.org/dylanaubrey/cachemap.svg?branch=master)](https://travis-ci.org/dylanaubrey/cachemap)
[![Sauce Test Status](https://saucelabs.com/buildstatus/cachemap)](https://saucelabs.com/u/cachemap)
[![codecov](https://codecov.io/gh/dylanaubrey/cachemap/branch/master/graph/badge.svg)](https://codecov.io/gh/dylanaubrey/cachemap)
[![Quality Gate](https://sonarcloud.io/api/badges/gate?key=sonarqube:cachemap)](https://sonarcloud.io/dashboard?id=sonarqube%3Acachemap)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/cachemap.svg)](https://badge.fury.io/js/cachemap)
[![dependencies Status](https://david-dm.org/dylanaubrey/cachemap/status.svg)](https://david-dm.org/dylanaubrey/cachemap)
[![devDependencies Status](https://david-dm.org/dylanaubrey/cachemap/dev-status.svg)](https://david-dm.org/dylanaubrey/cachemap?type=dev)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/cachemap.svg)](https://saucelabs.com/u/cachemap)

### Summary
* Use Redis or an in-memory Map on the server.
* Use LocalStorage, IndexedDB or an in-memory Map on the client.
* Export/import entries and metadata from one cachemap to another.
* Store data alongside cache-control directives, etag and uuid (tag).
* Cache headers used to derive whether data is fresh or stale.
* Sort stored data based on metadata values.
* Build-in reaper to cull stale data at specified intervals.
* Set approximate maximum memory size for data.
* Use on main thread or as web worker in browser.

### Installation
```
npm install cachemap --save
```

### Compilation
A couple of notes on compilation. Firstly, the `WEB_ENV` environment variable must be set when you compile your browser bundle in order to exclude Redis from the build. Secondly, the worker cachemap is currently only set up to be built with Webpack's worker-loader via blob URL.

### Documentation
Please read the documentation on the cachemap [github pages](https://dylanaubrey.github.io/cachemap).