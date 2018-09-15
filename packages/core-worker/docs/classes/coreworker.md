[@cachemap/core-worker](../README.md) > [CoreWorker](../classes/coreworker.md)

# Class: CoreWorker

## Hierarchy

**CoreWorker**

## Index

### Constructors

* [constructor](coreworker.md#constructor)

### Properties

* [storeType](coreworker.md#storetype)

### Accessors

* [metadata](coreworker.md#metadata)
* [name](coreworker.md#name)
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
* [terminate](coreworker.md#terminate)
* [init](coreworker.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new CoreWorker**(options: *[ConstructorOptions](../interfaces/constructoroptions.md)*): [CoreWorker](coreworker.md)

*Defined in [main/index.ts:41](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L41)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| options | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** [CoreWorker](coreworker.md)

___

## Properties

<a id="storetype"></a>

###  storeType

**● storeType**: *`string`* = "indexedDB"

*Defined in [main/index.ts:36](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L36)*

___

## Accessors

<a id="metadata"></a>

###  metadata

getmetadata(): `Metadata`[]

*Defined in [main/index.ts:49](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L49)*

**Returns:** `Metadata`[]

___
<a id="name"></a>

###  name

getname(): `string`

*Defined in [main/index.ts:53](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L53)*

**Returns:** `string`

___
<a id="usedheapsize"></a>

###  usedHeapSize

getusedHeapSize(): `number`

*Defined in [main/index.ts:57](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L57)*

**Returns:** `number`

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `Promise`<`void`>

*Defined in [main/index.ts:61](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L61)*

**Returns:** `Promise`<`void`>

___
<a id="delete"></a>

###  delete

▸ **delete**(key: *`string`*, options?: *`object`*): `Promise`<`boolean`>

*Defined in [main/index.ts:70](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L70)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| key | `string` | - |
| `Default value` options | `object` |  {} |

**Returns:** `Promise`<`boolean`>

___
<a id="entries"></a>

###  entries

▸ **entries**(keys?: *`string`[]*): `Promise`<`Array`<[`string`, `any`]>>

*Defined in [main/index.ts:80](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L80)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` keys | `string`[] |

**Returns:** `Promise`<`Array`<[`string`, `any`]>>

___
<a id="export"></a>

###  export

▸ **export**(options?: *`ExportOptions`*): `Promise`<`ExportResult`>

*Defined in [main/index.ts:90](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L90)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` options | `ExportOptions` |  {} |

**Returns:** `Promise`<`ExportResult`>

___
<a id="get"></a>

###  get

▸ **get**(key: *`string`*, options?: *`object`*): `Promise`<`any`>

*Defined in [main/index.ts:100](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L100)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| key | `string` | - |
| `Default value` options | `object` |  {} |

**Returns:** `Promise`<`any`>

___
<a id="has"></a>

###  has

▸ **has**(key: *`string`*, options?: *`object`*): `Promise`< `false` &#124; `Cacheability`>

*Defined in [main/index.ts:110](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L110)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| key | `string` | - |
| `Default value` options | `object` |  {} |

**Returns:** `Promise`< `false` &#124; `Cacheability`>

___
<a id="import"></a>

###  import

▸ **import**(options: *`ImportOptions`*): `Promise`<`void`>

*Defined in [main/index.ts:124](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L124)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| options | `ImportOptions` |

**Returns:** `Promise`<`void`>

___
<a id="set"></a>

###  set

▸ **set**(key: *`string`*, value: *`any`*, options?: *`object`*): `Promise`<`any`>

*Defined in [main/index.ts:133](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L133)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| key | `string` | - |
| value | `any` | - |
| `Default value` options | `object` |  {} |

**Returns:** `Promise`<`any`>

___
<a id="size"></a>

###  size

▸ **size**(): `Promise`<`number`>

*Defined in [main/index.ts:146](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L146)*

**Returns:** `Promise`<`number`>

___
<a id="terminate"></a>

###  terminate

▸ **terminate**(): `void`

*Defined in [main/index.ts:156](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L156)*

**Returns:** `void`

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../interfaces/initoptions.md)*): `Promise`<[CoreWorker](coreworker.md)>

*Defined in [main/index.ts:9](https://github.com/dylanaubrey/cachemap/blob/58bca6e/packages/core-worker/src/main/index.ts#L9)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| options | [InitOptions](../interfaces/initoptions.md) |

**Returns:** `Promise`<[CoreWorker](coreworker.md)>

___

