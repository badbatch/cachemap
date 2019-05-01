[Documentation](../README.md) > [CoreWorker](../classes/coreworker.md)

# Class: CoreWorker

## Hierarchy

**CoreWorker**

## Index

### Constructors

* [constructor](coreworker.md#constructor)

### Accessors

* [metadata](coreworker.md#metadata)
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

*Defined in [main/index.ts:38](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L38)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| worker | `Worker` |

**Returns:** [CoreWorker](coreworker.md)

___

## Accessors

<a id="metadata"></a>

###  metadata

**get metadata**(): `Metadata`[]

*Defined in [main/index.ts:45](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L45)*

**Returns:** `Metadata`[]

___
<a id="storetype"></a>

###  storeType

**get storeType**(): `string` \| `undefined`

*Defined in [main/index.ts:49](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L49)*

**Returns:** `string` \| `undefined`

___
<a id="usedheapsize"></a>

###  usedHeapSize

**get usedHeapSize**(): `number`

*Defined in [main/index.ts:53](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L53)*

**Returns:** `number`

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `Promise`<`void`>

*Defined in [main/index.ts:57](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L57)*

**Returns:** `Promise`<`void`>

___
<a id="delete"></a>

###  delete

▸ **delete**(key: *`string`*, options?: *`object`*): `Promise`<`boolean`>

*Defined in [main/index.ts:66](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L66)*

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

*Defined in [main/index.ts:76](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L76)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` keys | `string`[] |

**Returns:** `Promise`<`Array`<[`string`, `any`]>>

___
<a id="export"></a>

###  export

▸ **export**(options?: *`ExportOptions`*): `Promise`<`ExportResult`>

*Defined in [main/index.ts:86](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L86)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` options | `ExportOptions` |  {} |

**Returns:** `Promise`<`ExportResult`>

___
<a id="get"></a>

###  get

▸ **get**(key: *`string`*, options?: *`object`*): `Promise`<`any`>

*Defined in [main/index.ts:96](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L96)*

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

*Defined in [main/index.ts:106](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L106)*

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

*Defined in [main/index.ts:120](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L120)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | `ImportOptions` |

**Returns:** `Promise`<`void`>

___
<a id="set"></a>

###  set

▸ **set**(key: *`string`*, value: *`any`*, options?: *`object`*): `Promise`<`any`>

*Defined in [main/index.ts:129](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L129)*

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

*Defined in [main/index.ts:142](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L142)*

**Returns:** `Promise`<`number`>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../interfaces/initoptions.md)*): `Promise`<[CoreWorker](coreworker.md)>

*Defined in [main/index.ts:18](https://github.com/badbatch/cachemap/blob/6985edf/packages/core-worker/src/main/index.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [InitOptions](../interfaces/initoptions.md) |

**Returns:** `Promise`<[CoreWorker](coreworker.md)>

___

