[Documentation](../README.md) › [CoreWorker](coreworker.md)

# Class: CoreWorker

## Hierarchy

* **CoreWorker**

## Index

### Constructors

* [constructor](coreworker.md#constructor)

### Accessors

* [emitter](coreworker.md#emitter)
* [metadata](coreworker.md#metadata)
* [name](coreworker.md#name)
* [storeType](coreworker.md#storetype)
* [type](coreworker.md#type)
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

### Object literals

* [events](coreworker.md#events)

## Constructors

###  constructor

\+ **new CoreWorker**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[CoreWorker](coreworker.md)*

*Defined in [main/index.ts:47](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[CoreWorker](coreworker.md)*

## Accessors

###  emitter

• **get emitter**(): *EventEmitter*

*Defined in [main/index.ts:79](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L79)*

**Returns:** *EventEmitter*

___

###  metadata

• **get metadata**(): *Metadata[]*

*Defined in [main/index.ts:83](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L83)*

**Returns:** *Metadata[]*

___

###  name

• **get name**(): *string*

*Defined in [main/index.ts:87](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L87)*

**Returns:** *string*

___

###  storeType

• **get storeType**(): *string | undefined*

*Defined in [main/index.ts:91](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L91)*

**Returns:** *string | undefined*

___

###  type

• **get type**(): *string*

*Defined in [main/index.ts:95](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L95)*

**Returns:** *string*

___

###  usedHeapSize

• **get usedHeapSize**(): *number*

*Defined in [main/index.ts:99](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L99)*

**Returns:** *number*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [main/index.ts:103](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L103)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string, `options`: object): *Promise‹boolean›*

*Defined in [main/index.ts:112](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L112)*

**Parameters:**

▪ **key**: *string*

▪`Default value`  **options**: *object*= {}

Name | Type |
------ | ------ |
`hash?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹boolean›*

___

###  entries

▸ **entries**(`keys?`: string[]): *Promise‹[string, any][]›*

*Defined in [main/index.ts:122](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L122)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹[string, any][]›*

___

###  export

▸ **export**(`options`: ExportOptions): *Promise‹ExportResult›*

*Defined in [main/index.ts:132](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L132)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | ExportOptions | {} |

**Returns:** *Promise‹ExportResult›*

___

###  get

▸ **get**(`key`: string, `options`: object): *Promise‹any›*

*Defined in [main/index.ts:142](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L142)*

**Parameters:**

▪ **key**: *string*

▪`Default value`  **options**: *object*= {}

Name | Type |
------ | ------ |
`hash?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹any›*

___

###  has

▸ **has**(`key`: string, `options`: object): *Promise‹false | Cacheability›*

*Defined in [main/index.ts:152](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L152)*

**Parameters:**

▪ **key**: *string*

▪`Default value`  **options**: *object*= {}

Name | Type |
------ | ------ |
`deleteExpired?` | undefined &#124; false &#124; true |
`hash?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹false | Cacheability›*

___

###  import

▸ **import**(`options`: ImportOptions): *Promise‹void›*

*Defined in [main/index.ts:169](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L169)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | ImportOptions |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any, `options`: object): *Promise‹any›*

*Defined in [main/index.ts:178](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L178)*

**Parameters:**

▪ **key**: *string*

▪ **value**: *any*

▪`Default value`  **options**: *object*= {}

Name | Type |
------ | ------ |
`cacheHeaders?` | CacheHeaders |
`hash?` | undefined &#124; false &#124; true |
`tag?` | any |

**Returns:** *Promise‹any›*

___

###  size

▸ **size**(): *Promise‹number›*

*Defined in [main/index.ts:191](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L191)*

**Returns:** *Promise‹number›*

## Object literals

###  events

### ▪ **events**: *object*

*Defined in [main/index.ts:36](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L36)*

###  ENTRY_DELETED

• **ENTRY_DELETED**: *string* = "ENTRY_DELETED"

*Defined in [main/index.ts:37](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core-worker/src/main/index.ts#L37)*
