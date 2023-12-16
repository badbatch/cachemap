#### 5.0.5 (2023-12-16)

##### Bug Fixes

*  pnppm version in pipeline (06473ba1)

##### Refactors

*  better support esm and cjs (a9804560)

#### 5.0.4 (2023-11-28)

##### Bug Fixes

*  update installation examples to npm (e470eb34)

#### 5.0.3 (2023-11-22)

##### Chores

*  upgrade cacheability deps (533ec8ef)

#### 5.0.2 (2023-11-22)

##### New Features

*  upgrade syncpack (ba336eef)
*  move to exports map (40ab4949)

#### 5.0.1 (2023-10-16)

##### Documentation Changes

*  clarify install dependencies (4f85e61b)

#### 5.0.0 (2023-10-12)

##### Bug Fixes

*  update lock file (cb8e25c0)
*  remove reduendant deps (6f526d9f)

#### 4.0.4 (2023-10-12)

##### Documentation Changes

*  update readmes (b49346ab)

##### New Features

*  migrate repo over to esmodules (#48) (106666e2)

#### 4.0.4 (2023-08-13)

##### Bug Fixes

*  output  mjs files for module ([ca43a4d3](https://github.com/badbatch/cachemap/commit/ca43a4d361f37d76726984be1926bf167a5da8ed))

#### 4.0.3 (2023-07-13)

##### Bug Fixes

*  add named exports ([f503e0e1](https://github.com/badbatch/cachemap/commit/f503e0e12475b3434574b9dc6b07b73700d78b70))

#### 4.0.2 (2023-07-13)

##### Refactors

*  named export core class ([27e229b0](https://github.com/badbatch/cachemap/commit/27e229b057d4977ec3ba917dcc0bce9ea4778ae8))

#### 4.0.1 (2022-12-08)

## 4.0.0 (2022-03-31)

##### New Features

*  backup to persisted storage and delete entry event emitter ([#36](https://github.com/badbatch/cachemap/pull/36)) ([141407d7](https://github.com/badbatch/cachemap/commit/141407d7c8f128f8827f3d304751195ceb0a2064))

#### 3.3.2 (2021-12-27)

##### Bug Fixes

*  bind core worker event handlers ([29323d92](https://github.com/badbatch/cachemap/commit/29323d921a42d2f2c3e6190dbc4a6f73736c635f))

#### 3.3.1 (2021-12-25)

##### Bug Fixes

*  event handler binding within core ([631c61ba](https://github.com/badbatch/cachemap/commit/631c61bac0289d18abd574d29d676da9c467a205))

### 3.3.0 (2021-12-23)

##### New Features

*  set reaper to initialise without starting by default ([b1807986](https://github.com/badbatch/cachemap/commit/b18079866768bd145d023a50e0a0c0a6ef7ce6ec))

### 3.2.0 (2021-12-22)

##### New Features

*  add controller module ([62390881](https://github.com/badbatch/cachemap/commit/62390881d3bdc115ef937099c820169235c18021))

##### Refactors

*  add type contructor prop to core ([789ce496](https://github.com/badbatch/cachemap/commit/789ce496c2832f48eb38d3312bd0a3676921da1e))

#### 3.1.5 (2021-12-17)

##### Bug Fixes

*  used heap size not being reset on clear ([497d8de9](https://github.com/badbatch/cachemap/commit/497d8de9c9eb9455a0d60412762d7fbb0eb46612))

#### 3.1.4 (2021-09-16)

##### Chores

*  another attempt with actions config ([a5c9fb39](https://github.com/badbatch/cachemap/commit/a5c9fb397658a765aa87562cb85f73b306ee1ccc))
*  another update to tag logic ([e01c9e23](https://github.com/badbatch/cachemap/commit/e01c9e23748568c2ecda28f682073bceed75b15a))

##### Bug Fixes

*  clear request queue when all requests have been resolved ([28dde3d8](https://github.com/badbatch/cachemap/commit/28dde3d8abaa0b556cb7771532b66bf1b3da996e))

#### 3.1.3 (2021-05-21)

##### Bug Fixes

*  alt approach to setting tag output ([4cf17242](https://github.com/badbatch/cachemap/commit/4cf1724294f622b632c57f4c5957d4bfde12e3bc))

#### 3.1.2 (2021-05-21)

##### Bug Fixes

*  typo in actions config ([4dfa510b](https://github.com/badbatch/cachemap/commit/4dfa510ba121b1ae4622c562ed638f5c3d0a1c25))
*  typo in actions config ([ba9f48a5](https://github.com/badbatch/cachemap/commit/ba9f48a5388d36ac22c05d0248da05e16a7a2365))
*  typo in actions config ([a4038f09](https://github.com/badbatch/cachemap/commit/a4038f09961ea5f729f19565b67c4f1611e38934))
*  update way of storing variables ([950c8c67](https://github.com/badbatch/cachemap/commit/950c8c677f65792a77487a9b25ac96113d9e4860))
*  names of action scripts ([8bbd4a46](https://github.com/badbatch/cachemap/commit/8bbd4a46df9574e9f10187433d0826032ae3d875))

##### Refactors

*  move builds to be combined again ([5c288399](https://github.com/badbatch/cachemap/commit/5c2883996a20eaf8c666c8b2bd5f7a48d3fb9d00))
*  split build and deploy action configs ([cabdd40c](https://github.com/badbatch/cachemap/commit/cabdd40c75b0d6dd964e78555dc4fcdd492f3a69))

#### 3.1.1 (2021-05-21)

##### Bug Fixes

*  mistake in actions config ([ba019baa](https://github.com/badbatch/cachemap/commit/ba019baa70a4d26223990531d5e0f3c03cbc4c83))
*  update actions config ([8ff4a773](https://github.com/badbatch/cachemap/commit/8ff4a773d69eaa3a1b38a7ffd4985787a759b0d5))

### 3.1.0 (2021-05-21)

##### New Features

*  add actions badge to readme ([78d1a971](https://github.com/badbatch/cachemap/commit/78d1a97106063dc5e3ae4095a0893f2eee5ace9c))
*  move to github actions ([e7325101](https://github.com/badbatch/cachemap/commit/e73251017de3552468566d75d49b94261e0d8d72))
*  enable filter by value in export ([53585a0f](https://github.com/badbatch/cachemap/commit/53585a0f2bf10367ace2f1383ba9de8758bf9ef9))
*  add encryption and encoding ([515f09e7](https://github.com/badbatch/cachemap/commit/515f09e7b6500c4da3dbd199649fcc6c76a75bb0))

##### Bug Fixes

*  use of double quotes in actions config ([1be9499e](https://github.com/badbatch/cachemap/commit/1be9499ebf2b55e0f6a1bd338dd213677d77f8b4))
*  typo in actions file ([c9b09523](https://github.com/badbatch/cachemap/commit/c9b095230bcbbb355f5cd377eb4a6f0c242cb1f7))
*  delete travis file ([a88fa197](https://github.com/badbatch/cachemap/commit/a88fa197c5df01d74704a3d9a72b4ffa86add4db))
*  update travis url ([60c4e976](https://github.com/badbatch/cachemap/commit/60c4e976c0b66b066fd483c9ea23ebc5d83bbc85))

#### 3.0.4 (2020-03-02)

##### Chores

*  updating dependencies and peer versions ([50a09ddf](https://github.com/badbatch/cachemap/commit/50a09ddff17db212211252bc5c0d0b0987e66229))

#### 3.0.3 (2019-11-15)

##### Bug Fixes

* **constants:**  add public scope to package json ([f68b2bfb](https://github.com/badbatch/cachemap/commit/f68b2bfb4019ede76ab65302556ff02f398ca5f8))

#### 3.0.2 (2019-11-15)

##### Bug Fixes

* **constants:**  add npmrc ([2f4f64a5](https://github.com/badbatch/cachemap/commit/2f4f64a5377bd7d0e43172d7e4d9eb3bc2c4b120))

#### 3.0.1 (2019-11-15)

##### Bug Fixes

*  update peer dependency versions ([34d12b9d](https://github.com/badbatch/cachemap/commit/34d12b9d2744aae37db7586029c3870c0156c3f0))

## 3.0.0 (2019-11-15)

##### Documentation Changes

*  update docs to reflect syc init for core and core-worker ([1f506166](https://github.com/badbatch/cachemap/commit/1f506166857066baa0b22b121899fdb7bcc1f4ec))

##### Refactors

*  create constants package ([5679b70a](https://github.com/badbatch/cachemap/commit/5679b70a46502cd27259d9eef914de29e88b2aab))
*  changing folder/file structure and exports ([f4b1374e](https://github.com/badbatch/cachemap/commit/f4b1374e5df6da16d069020c0950e8a83e6550ad))
*  moving core-worker to sync init ([acf663c2](https://github.com/badbatch/cachemap/commit/acf663c29d0811cfd985ae1938d817fd8b533176))
*  moving cashmap init to sync ([a6ae2457](https://github.com/badbatch/cachemap/commit/a6ae2457e27675ea715434d4a4e99af485c1719e))

## 2.0.0 (2019-11-05)

##### Chores

*  upgrade dependencies, including core-js ([40e3beaa](https://github.com/badbatch/cachemap/commit/40e3beaa6aa2b3fae40431039adae0087df96d00))

#### 1.4.2 (2019-10-10)

##### Chores

*  update dependencies ([9f3c9798](https://github.com/badbatch/cachemap/commit/9f3c97989389e8f7d2c23b58acc21483b03d93b7))
*  update scripts ([f538d136](https://github.com/badbatch/cachemap/commit/f538d13674324a7252138e27ecb80f91021ea07e))
*  update travis scripts ([beed2a71](https://github.com/badbatch/cachemap/commit/beed2a71aba13a24213115ff1587c3f99fac90e5))
*  update dependencies ([c7099f2e](https://github.com/badbatch/cachemap/commit/c7099f2ecef47f456dbf64d9b07c439796252fd8))
*  update scripts to add source maps ([5ae26e48](https://github.com/badbatch/cachemap/commit/5ae26e485e07b87cd555345b8a9af0ca52d36225))

##### Bug Fixes

*  scripts broken and missing commands ([00de699d](https://github.com/badbatch/cachemap/commit/00de699d76bf8ef5d3cc01739f1892c55b1ec242))

#### 1.4.1 (2019-09-06)

##### Chores

* **repo:**
  *  update dependencies ([13ed3886](https://github.com/badbatch/cachemap/commit/13ed3886bb5292ebed2c9f6393724e0fb0ae5195))
  *  upgrade depencencies ([d7d1d5ff](https://github.com/badbatch/cachemap/commit/d7d1d5ffc3d6f366252366841f36779809718d83))
* **dependencies:**  update dependencies and run docs ([78eb8f81](https://github.com/badbatch/cachemap/commit/78eb8f81fd9cfdcdc669b304111461b5902d1907))

### 1.4.0 (2019-08-30)

##### Chores

* **dependencies:**  update dependencies and fix follow on issues ([e34b125e](https://github.com/badbatch/cachemap/commit/e34b125edcf5d7c43cf65de61db007436f70331e))
* **node:**  update version to latest stable. ([a45bfbd6](https://github.com/badbatch/cachemap/commit/a45bfbd6dee0e0d1a257fccca39af0acbec28fda))

##### New Features

* **repodog:**  add additional repodog config packages ([594d4801](https://github.com/badbatch/cachemap/commit/594d48016520b409401b46603b5bdd546e8887ce))

##### Bug Fixes

* **tsconfig:**  move to using repodog config ([4fa61050](https://github.com/badbatch/cachemap/commit/4fa610507087e9635e9db25ef0b5410c5c6a2d43))
* **npm:**  allow src files to be in packages ([d39ccdfe](https://github.com/badbatch/cachemap/commit/d39ccdfe3953d8c7e0656ffcffc4c2d44adc0afa))
* **package.json:**  update validate script ([5e13ba7f](https://github.com/badbatch/cachemap/commit/5e13ba7f49f83f51800f38fcb78f487d1cb85611))
* **dependencies:**  change internal deps to peer ([c0bd2de4](https://github.com/badbatch/cachemap/commit/c0bd2de45bb1ea5f62adff6a61599e6f02c8a4c3))

#### 1.3.1 (2019-07-29)

##### Chores

* **update dependencies:**  upgrade dependencies. ([52c713b0](https://github.com/badbatch/cachemap/commit/52c713b0ce20870399099bad6f033688a1f644d2))

### 1.3.0 (2019-06-30)

##### Chores

* **repository:**  update dependencies. ([3de6fa72](https://github.com/badbatch/cachemap/commit/3de6fa724cb557d1dc515e07aa9b81b6fa9305d6))

##### Bug Fixes

* **travis:**  update node version in config. ([f0089aa1](https://github.com/badbatch/cachemap/commit/f0089aa194c2b8a7b9f09be5e0e8d2e5a0471f98))

### 1.2.0 (2019-05-04)

##### Chores

* **corejs:**  downgrade back to v2. ([1fafbcaf](https://github.com/badbatch/cachemap/commit/1fafbcafc46e531eea4ffc3c79e3612f272a0e77))

#### 1.1.4 (2019-05-01)

#### 1.1.3 (2019-05-01)

##### Bug Fixes

* **build process:**  nested dependencies in third party apps. ([2e6445d0](https://github.com/badbatch/cachemap/commit/2e6445d07909d767dc1d6df1c9b494d5f03b379a))

#### 1.1.2 (2019-05-01)

##### Bug Fixes

* **build process:**  Adding npmignore to packages. ([4e23125e](https://github.com/badbatch/cachemap/commit/4e23125e515198ba00475045f00feed0d79e9ea7))

#### 1.1.1 (2019-05-01)

##### Documentation Changes

* **readme:**  update worker usage. ([64dbdb80](https://github.com/badbatch/cachemap/commit/64dbdb802bfe9d7bb5589fac69d989bf6bb7330c))

##### Bug Fixes

* **core worker:**  remove name prop as not necessary and update docs. ([9cf77b91](https://github.com/badbatch/cachemap/commit/9cf77b9126aee0a25c34a07085af438dd77d214b))
* **build process:**  change the way core and babel runtime are used. ([1c3ca662](https://github.com/badbatch/cachemap/commit/1c3ca662741d3723acee34ffc1e0b804ef5986c2))

### 1.1.0 (2019-04-30)

##### Other Changes

* **core worker:**  allow worker to be passed in and message handler to be reused by other libraries. ([#23](https://github.com/badbatch/cachemap/pull/23)) ([e3c87c42](https://github.com/badbatch/cachemap/commit/e3c87c42d77f0c462c1687d1ee06f06b63ca59e5))

#### 1.0.4 (2018-09-17)

##### Chores

* **repository:**  Updating organisation name. ([8594d339](https://github.com/badbatch/cachemap/commit/8594d3391903839207c19635b32c8333f2cd8d08))

#### 1.0.3 (2018-09-16)

##### Documentation Changes

* **readme:**  updating link to parent repo readme. ([7f050c09](https://github.com/badbatch/cachemap/commit/7f050c094ae67790106e9ae47c2b6a2a22222198))

#### 1.0.2 (2018-09-16)

##### Documentation Changes

* **readme:**  Remove repo npm package link ([f51be43a](https://github.com/badbatch/cachemap/commit/f51be43ae2cc589dc3356514d514df0dfeea8ec1))

##### Bug Fixes

* **packages:**  update readme structure ([#22](https://github.com/badbatch/cachemap/pull/22)) ([a29d46fe](https://github.com/badbatch/cachemap/commit/a29d46fef8da017c043f087e331cd655648d02b5))

#### 1.0.1 (2018-09-15)

##### Bug Fixes

* **docs:**  Removing docs folder from npm ignore as readme is now in that folder. ([89d29b6e](https://github.com/badbatch/cachemap/commit/89d29b6e489c64fdd43d6891660641a9374ae331))

## 1.0.0 (2018-09-15)

##### Breaking Changes

* **repository:**  Split modules into separate packages in monorepo ([#21](https://github.com/badbatch/cachemap/pull/21)) ([88530d7d](https://github.com/badbatch/cachemap/commit/88530d7db14fee7e18eec5361c8f590554ff6d62))

### 0.3.0 (2018-07-02)

##### Chores

* **dependencies:**  Updating dependencies and resolving related issues. ([#20](https://github.com/badbatch/cachemap/pull/20)) ([ab318e7f](https://github.com/badbatch/cachemap/commit/ab318e7fbeb3579beaab99693e9b0f7fd81c60f1))

##### Bug Fixes

* **config:**  Update urls in package.json. ([4072f5d4](https://github.com/badbatch/cachemap/commit/4072f5d4ebbc36c1e8d98cba00a9dffc22b2fb93))

#### 0.2.2 (2018-06-13)

##### Chores

* **dependencies:**  Update cacheability version. ([83399461](https://github.com/dylanaubrey/cachemap/commit/8339946148b8405fdaea50de64880ebee70ce33c))

##### Bug Fixes

* **tests:**  Updating test folder name. ([b2b767fb](https://github.com/dylanaubrey/cachemap/commit/b2b767fb968b5bbb12dfdaa1cc4b1029d5af9e6f))

#### 0.2.1 (2018-06-12)

##### Chores

* **dependencies:**  Update cacheability to latest  version. ([cb3faa74](https://github.com/dylanaubrey/cachemap/commit/cb3faa7483895e315f571e620aac33e7d35b205e))

##### Bug Fixes

* **config:**  Updating npmignore file to include codecov config. ([a4ae334d](https://github.com/dylanaubrey/cachemap/commit/a4ae334dcbcdbfbfcdd711cb6a4cc3ab9b2ca71b))

### 0.2.0 (2018-06-12)

##### Refactors

* **repository:**  Move to yarn and upgrade dependencies ([#19](https://github.com/dylanaubrey/cachemap/pull/19)) ([8faef58f](https://github.com/dylanaubrey/cachemap/commit/8faef58fb317e663e774774c8194d5967f3aa6a6))

