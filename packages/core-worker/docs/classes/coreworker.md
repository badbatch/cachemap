[Documentation](../README.md) > [CoreWorker](../classes/coreworker.md)

# Class: CoreWorker

## Hierarchy

**CoreWorker**

## Index

### Constructors

* [constructor](coreworker.md#constructor)

### Accessors

* [metadata](coreworker.md#metadata)
* [name](coreworker.md#name)
* [storeType](coreworker.md#storetype)
* [usedHeapSize](coreworker.md#usedheapsize)

### Methods

* [clear](coreworker.md#clear)
* [delete](coreworker.md#delete)
* [entries](coreworker.md#entries)
* [export](coreworker.md#export)
* [get](coreworker.md#get)
* [has](coreworker.md#has)
* [import](coreworker.md#import)
* [set](coreworker.md#set)
* [size](coreworker.md#size)
* [init](coreworker.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new CoreWorker**(__namedParameters: *`object`*): [CoreWorker](coreworker.md)

*Defined in [main/index.ts:39](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L39)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| name | `string` |
| worker | `Worker` |

**Returns:** [CoreWorker](coreworker.md)

___

## Accessors

<a id="metadata"></a>

###  metadata

**get metadata**(): `Metadata`[]

*Defined in [main/index.ts:47](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L47)*

**Returns:** `Metadata`[]

___
<a id="name"></a>

###  name

**get name**(): `string`

*Defined in [main/index.ts:51](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L51)*

**Returns:** `string`

___
<a id="storetype"></a>

###  storeType

**get storeType**(): `string` \| `undefined`

*Defined in [main/index.ts:55](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L55)*

**Returns:** `string` \| `undefined`

___
<a id="usedheapsize"></a>

###  usedHeapSize

**get usedHeapSize**(): `number`

*Defined in [main/index.ts:59](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L59)*

**Returns:** `number`

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `Promise`<`void`>

*Defined in [main/index.ts:63](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L63)*

**Returns:** `Promise`<`void`>

___
<a id="delete"></a>

###  delete

▸ **delete**(key: *`string`*, options?: *`object`*): `Promise`<`boolean`>

*Defined in [main/index.ts:72](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L72)*

**Parameters:**

**key: `string`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` hash | `undefined` \| `false` \| `true` |

**Returns:** `Promise`<`boolean`>

___
<a id="entries"></a>

###  entries

▸ **entries**(keys?: *`string`[]*): `Promise`<`Array`<[`string`, `any`]>>

*Defined in [main/index.ts:82](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L82)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` keys | `string`[] |

**Returns:** `Promise`<`Array`<[`string`, `any`]>>

___
<a id="export"></a>

###  export

▸ **export**(options?: *`ExportOptions`*): `Promise`<`ExportResult`>

*Defined in [main/index.ts:92](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L92)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` options | `ExportOptions` |  {} |

**Returns:** `Promise`<`ExportResult`>

___
<a id="get"></a>

###  get

▸ **get**(key: *`string`*, options?: *`object`*): `Promise`<`any`>

*Defined in [main/index.ts:102](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L102)*

**Parameters:**

**key: `string`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` hash | `undefined` \| `false` \| `true` |

**Returns:** `Promise`<`any`>

___
<a id="has"></a>

###  has

▸ **has**(key: *`string`*, options?: *`object`*): `Promise`<`false` \| `Cacheability`>

*Defined in [main/index.ts:112](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L112)*

**Parameters:**

**key: `string`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` deleteExpired | `undefined` \| `false` \| `true` |
| `Optional` hash | `undefined` \| `false` \| `true` |

**Returns:** `Promise`<`false` \| `Cacheability`>

___
<a id="import"></a>

###  import

▸ **import**(options: *`ImportOptions`*): `Promise`<`void`>

*Defined in [main/index.ts:126](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L126)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | `ImportOptions` |

**Returns:** `Promise`<`void`>

___
<a id="set"></a>

###  set

▸ **set**(key: *`string`*, value: *`any`*, options?: *`object`*): `Promise`<`any`>

*Defined in [main/index.ts:135](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L135)*

**Parameters:**

**key: `string`**

**value: `any`**

**`Default value` options: `object`**

| Name | Type |
| ------ | ------ |
| `Optional` cacheHeaders | `coreDefs.CacheHeaders` |
| `Optional` hash | `undefined` \| `false` \| `true` |
| `Optional` tag | `any` |

**Returns:** `Promise`<`any`>

___
<a id="size"></a>

###  size

▸ **size**(): `Promise`<`number`>

*Defined in [main/index.ts:148](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L148)*

**Returns:** `Promise`<`number`>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../interfaces/initoptions.md)*): `Promise`<[CoreWorker](coreworker.md)>

*Defined in [main/index.ts:18](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/main/index.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [InitOptions](../interfaces/initoptions.md) |

**Returns:** `Promise`<[CoreWorker](coreworker.md)>

___

