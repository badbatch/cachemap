[Documentation](README.md)

# Documentation

## Index

### Classes

* [CoreWorker](classes/coreworker.md)

### Interfaces

* [CommonOptions](interfaces/commonoptions.md)
* [ConstructorOptions](interfaces/constructoroptions.md)
* [FilterPropsResult](interfaces/filterpropsresult.md)
* [PendingData](interfaces/pendingdata.md)
* [PostMessage](interfaces/postmessage.md)
* [PostMessageResult](interfaces/postmessageresult.md)
* [PostMessageResultWithMeta](interfaces/postmessageresultwithmeta.md)
* [PostMessageWithoutMeta](interfaces/postmessagewithoutmeta.md)
* [RegisterWorkerOptions](interfaces/registerworkeroptions.md)

### Type aliases

* [PendingResolver](README.md#pendingresolver)
* [PendingTracker](README.md#pendingtracker)

### Variables

* [addEventListener](README.md#addeventlistener)
* [postMessage](README.md#postmessage)

### Functions

* [filterProps](README.md#filterprops)
* [handleMessage](README.md#handlemessage)
* [registerWorker](README.md#registerworker)
* [requiresKey](README.md#requireskey)

## Type aliases

###  PendingResolver

Ƭ **PendingResolver**: *function*

*Defined in [types.ts:16](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/core-worker/src/types.ts#L16)*

#### Type declaration:

▸ (`value`: [PostMessageResultWithMeta](interfaces/postmessageresultwithmeta.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | [PostMessageResultWithMeta](interfaces/postmessageresultwithmeta.md) |

___

###  PendingTracker

Ƭ **PendingTracker**: *Map‹string, [PendingData](interfaces/pendingdata.md)›*

*Defined in [types.ts:22](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/core-worker/src/types.ts#L22)*

## Variables

###  addEventListener

• **addEventListener**: *addEventListener*

*Defined in [register-worker/index.ts:22](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/core-worker/src/register-worker/index.ts#L22)*

___

###  postMessage

• **postMessage**: *postMessage*

*Defined in [register-worker/index.ts:22](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/core-worker/src/register-worker/index.ts#L22)*

## Functions

###  filterProps

▸ **filterProps**(`__namedParameters`: object): *[FilterPropsResult](interfaces/filterpropsresult.md)*

*Defined in [register-worker/index.ts:28](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/core-worker/src/register-worker/index.ts#L28)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`metadata` | Metadata[] |
`storeType` | string |
`usedHeapSize` | number |

**Returns:** *[FilterPropsResult](interfaces/filterpropsresult.md)*

___

###  handleMessage

▸ **handleMessage**(`message`: [PostMessage](interfaces/postmessage.md), `cachemap`: Core): *Promise‹void›*

*Defined in [register-worker/index.ts:32](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/core-worker/src/register-worker/index.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`message` | [PostMessage](interfaces/postmessage.md) |
`cachemap` | Core |

**Returns:** *Promise‹void›*

___

###  registerWorker

▸ **registerWorker**(`__namedParameters`: object): *Promise‹void›*

*Defined in [register-worker/index.ts:101](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/core-worker/src/register-worker/index.ts#L101)*

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`cachemap` | Core‹› |

**Returns:** *Promise‹void›*

___

###  requiresKey

▸ **requiresKey**(`type`: string): *boolean*

*Defined in [register-worker/index.ts:24](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/core-worker/src/register-worker/index.ts#L24)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | string |

**Returns:** *boolean*
