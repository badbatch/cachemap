> **[Documentation](README.md)**

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

* [ConstructorOptions](README.md#constructoroptions)
* [PendingResolver](README.md#pendingresolver)
* [PendingTracker](README.md#pendingtracker)

### Variables

* [CACHEMAP](README.md#const-cachemap)
* [CLEAR](README.md#const-clear)
* [DELETE](README.md#const-delete)
* [ENTRIES](README.md#const-entries)
* [EXPORT](README.md#const-export)
* [GET](README.md#const-get)
* [HAS](README.md#const-has)
* [IMPORT](README.md#const-import)
* [MESSAGE](README.md#const-message)
* [SET](README.md#const-set)
* [SIZE](README.md#const-size)
* [addEventListener](README.md#addeventlistener)
* [postMessage](README.md#postmessage)

### Functions

* [filterProps](README.md#filterprops)
* [handleMessage](README.md#handlemessage)
* [registerWorker](README.md#registerworker)
* [requiresKey](README.md#requireskey)

## Type aliases

###  ConstructorOptions

Ƭ **ConstructorOptions**: *[InitOptions](interfaces/initoptions.md)*

*Defined in [defs/index.ts:13](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/defs/index.ts#L13)*

___

###  PendingResolver

Ƭ **PendingResolver**: *function*

*Defined in [defs/index.ts:15](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/defs/index.ts#L15)*

#### Type declaration:

▸ (`value`: [PostMessageResultWithoutMeta](interfaces/postmessageresultwithoutmeta.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PostMessageResultWithoutMeta](interfaces/postmessageresultwithoutmeta.md) |

___

###  PendingTracker

Ƭ **PendingTracker**: *`Map<string, PendingData>`*

*Defined in [defs/index.ts:21](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/defs/index.ts#L21)*

## Variables

### `Const` CACHEMAP

• **CACHEMAP**: *"cachemap"* = "cachemap"

*Defined in [constants/index.ts:1](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L1)*

___

### `Const` CLEAR

• **CLEAR**: *"clear"* = "clear"

*Defined in [constants/index.ts:2](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L2)*

___

### `Const` DELETE

• **DELETE**: *"delete"* = "delete"

*Defined in [constants/index.ts:3](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L3)*

___

### `Const` ENTRIES

• **ENTRIES**: *"entries"* = "entries"

*Defined in [constants/index.ts:4](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L4)*

___

### `Const` EXPORT

• **EXPORT**: *"export"* = "export"

*Defined in [constants/index.ts:5](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L5)*

___

### `Const` GET

• **GET**: *"get"* = "get"

*Defined in [constants/index.ts:6](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L6)*

___

### `Const` HAS

• **HAS**: *"has"* = "has"

*Defined in [constants/index.ts:7](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L7)*

___

### `Const` IMPORT

• **IMPORT**: *"import"* = "import"

*Defined in [constants/index.ts:8](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L8)*

___

### `Const` MESSAGE

• **MESSAGE**: *"message"* = "message"

*Defined in [constants/index.ts:9](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L9)*

___

### `Const` SET

• **SET**: *"set"* = "set"

*Defined in [constants/index.ts:10](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L10)*

___

### `Const` SIZE

• **SIZE**: *"size"* = "size"

*Defined in [constants/index.ts:11](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/constants/index.ts#L11)*

___

###  addEventListener

• **addEventListener**: *`addEventListener`*

*Defined in [register-worker/index.ts:6](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/register-worker/index.ts#L6)*

___

###  postMessage

• **postMessage**: *`postMessage`*

*Defined in [register-worker/index.ts:6](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/register-worker/index.ts#L6)*

## Functions

###  filterProps

▸ **filterProps**(`__namedParameters`: object): *[FilterPropsResult](interfaces/filterpropsresult.md)*

*Defined in [register-worker/index.ts:12](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/register-worker/index.ts#L12)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`metadata` | `Metadata`[] |
`storeType` | string |
`usedHeapSize` | number |

**Returns:** *[FilterPropsResult](interfaces/filterpropsresult.md)*

___

###  handleMessage

▸ **handleMessage**(`message`: [PostMessage](interfaces/postmessage.md), `cachemap`: `Core`): *`Promise<void>`*

*Defined in [register-worker/index.ts:16](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/register-worker/index.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | [PostMessage](interfaces/postmessage.md) |
`cachemap` | `Core` |

**Returns:** *`Promise<void>`*

___

###  registerWorker

▸ **registerWorker**(`__namedParameters`: object): *`Promise<void>`*

*Defined in [register-worker/index.ts:63](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/register-worker/index.ts#L63)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cachemap` | `Core` |

**Returns:** *`Promise<void>`*

___

###  requiresKey

▸ **requiresKey**(`type`: string): *boolean*

*Defined in [register-worker/index.ts:8](https://github.com/badbatch/cachemap/blob/52c713b/packages/core-worker/src/register-worker/index.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |

**Returns:** *boolean*