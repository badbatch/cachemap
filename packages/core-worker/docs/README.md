
#  Documentation

## Index

### Classes

* [CoreWorker](classes/coreworker.md)

### Interfaces

* [CommonOptions](interfaces/commonoptions.md)
* [FilterPropsResult](interfaces/filterpropsresult.md)
* [InitOptions](interfaces/initoptions.md)
* [PendingData](interfaces/pendingdata.md)
* [PostMessage](interfaces/postmessage.md)
* [PostMessageResult](interfaces/postmessageresult.md)
* [PostMessageResultWithoutMeta](interfaces/postmessageresultwithoutmeta.md)
* [PostMessageWithoutMeta](interfaces/postmessagewithoutmeta.md)
* [RegisterWorkerOptions](interfaces/registerworkeroptions.md)

### Type aliases

* [ConstructorOptions](#constructoroptions)
* [PendingResolver](#pendingresolver)
* [PendingTracker](#pendingtracker)

### Variables

* [CACHEMAP](#cachemap)
* [CLEAR](#clear)
* [DELETE](#delete)
* [ENTRIES](#entries)
* [EXPORT](#export)
* [GET](#get)
* [HAS](#has)
* [IMPORT](#import)
* [MESSAGE](#message)
* [SET](#set)
* [SIZE](#size)
* [addEventListener](#addeventlistener)
* [postMessage](#postmessage)

### Functions

* [filterProps](#filterprops)
* [handleMessage](#handlemessage)
* [registerWorker](#registerworker)
* [requiresKey](#requireskey)

---

## Type aliases

<a id="constructoroptions"></a>

###  ConstructorOptions

**Ƭ ConstructorOptions**: *[InitOptions](interfaces/initoptions.md)*

*Defined in [defs/index.ts:14](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/defs/index.ts#L14)*

___
<a id="pendingresolver"></a>

###  PendingResolver

**Ƭ PendingResolver**: *`function`*

*Defined in [defs/index.ts:16](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/defs/index.ts#L16)*

#### Type declaration
▸(value: *[PostMessageResultWithoutMeta](interfaces/postmessageresultwithoutmeta.md)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | [PostMessageResultWithoutMeta](interfaces/postmessageresultwithoutmeta.md) |

**Returns:** `void`

___
<a id="pendingtracker"></a>

###  PendingTracker

**Ƭ PendingTracker**: *`Map`<`string`, [PendingData](interfaces/pendingdata.md)>*

*Defined in [defs/index.ts:22](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/defs/index.ts#L22)*

___

## Variables

<a id="cachemap"></a>

### `<Const>` CACHEMAP

**● CACHEMAP**: *"cachemap"* = "cachemap"

*Defined in [constants/index.ts:1](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L1)*

___
<a id="clear"></a>

### `<Const>` CLEAR

**● CLEAR**: *"clear"* = "clear"

*Defined in [constants/index.ts:2](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L2)*

___
<a id="delete"></a>

### `<Const>` DELETE

**● DELETE**: *"delete"* = "delete"

*Defined in [constants/index.ts:3](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L3)*

___
<a id="entries"></a>

### `<Const>` ENTRIES

**● ENTRIES**: *"entries"* = "entries"

*Defined in [constants/index.ts:4](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L4)*

___
<a id="export"></a>

### `<Const>` EXPORT

**● EXPORT**: *"export"* = "export"

*Defined in [constants/index.ts:5](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L5)*

___
<a id="get"></a>

### `<Const>` GET

**● GET**: *"get"* = "get"

*Defined in [constants/index.ts:6](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L6)*

___
<a id="has"></a>

### `<Const>` HAS

**● HAS**: *"has"* = "has"

*Defined in [constants/index.ts:7](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L7)*

___
<a id="import"></a>

### `<Const>` IMPORT

**● IMPORT**: *"import"* = "import"

*Defined in [constants/index.ts:8](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L8)*

___
<a id="message"></a>

### `<Const>` MESSAGE

**● MESSAGE**: *"message"* = "message"

*Defined in [constants/index.ts:9](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L9)*

___
<a id="set"></a>

### `<Const>` SET

**● SET**: *"set"* = "set"

*Defined in [constants/index.ts:10](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L10)*

___
<a id="size"></a>

### `<Const>` SIZE

**● SIZE**: *"size"* = "size"

*Defined in [constants/index.ts:11](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/constants/index.ts#L11)*

___
<a id="addeventlistener"></a>

###  addEventListener

**● addEventListener**: *`addEventListener`*

*Defined in [register-worker/index.ts:6](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/register-worker/index.ts#L6)*

___
<a id="postmessage"></a>

###  postMessage

**● postMessage**: *`postMessage`*

*Defined in [register-worker/index.ts:6](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/register-worker/index.ts#L6)*

___

## Functions

<a id="filterprops"></a>

###  filterProps

▸ **filterProps**(__namedParameters: *`object`*): [FilterPropsResult](interfaces/filterpropsresult.md)

*Defined in [register-worker/index.ts:12](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/register-worker/index.ts#L12)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| metadata | `Metadata`[] |
| storeType | `string` |
| usedHeapSize | `number` |

**Returns:** [FilterPropsResult](interfaces/filterpropsresult.md)

___
<a id="handlemessage"></a>

###  handleMessage

▸ **handleMessage**(message: *[PostMessage](interfaces/postmessage.md)*, cachemap: *`Core`*): `Promise`<`void`>

*Defined in [register-worker/index.ts:16](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/register-worker/index.ts#L16)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| message | [PostMessage](interfaces/postmessage.md) |
| cachemap | `Core` |

**Returns:** `Promise`<`void`>

___
<a id="registerworker"></a>

###  registerWorker

▸ **registerWorker**(__namedParameters: *`object`*): `Promise`<`void`>

*Defined in [register-worker/index.ts:63](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/register-worker/index.ts#L63)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| cachemap | `Core` |

**Returns:** `Promise`<`void`>

___
<a id="requireskey"></a>

###  requiresKey

▸ **requiresKey**(type: *`string`*): `boolean`

*Defined in [register-worker/index.ts:8](https://github.com/badbatch/cachemap/blob/e3c87c4/packages/core-worker/src/register-worker/index.ts#L8)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | `string` |

**Returns:** `boolean`

___

