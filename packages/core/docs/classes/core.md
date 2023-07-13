[Documentation](../README.md) › [Core](core.md)

# Class: Core

## Hierarchy

* **Core**

## Index

### Constructors

* [constructor](core.md#constructor)

### Accessors

* [emitter](core.md#emitter)
* [metadata](core.md#metadata)
* [name](core.md#name)
* [reaper](core.md#reaper)
* [storeType](core.md#storetype)
* [type](core.md#type)
* [usedHeapSize](core.md#usedheapsize)

### Methods

* [clear](core.md#clear)
* [delete](core.md#delete)
* [entries](core.md#entries)
* [export](core.md#export)
* [get](core.md#get)
* [has](core.md#has)
* [import](core.md#import)
* [set](core.md#set)
* [size](core.md#size)
* [startBackup](core.md#startbackup)
* [stopBackup](core.md#stopbackup)

### Object literals

* [events](core.md#events)

## Constructors

###  constructor

\+ **new Core**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[Core](core.md)*

*Defined in [core/src/main/index.ts:95](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L95)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[Core](core.md)*

## Accessors

###  emitter

• **get emitter**(): *EventEmitter*

*Defined in [core/src/main/index.ts:175](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L175)*

**Returns:** *EventEmitter*

___

###  metadata

• **get metadata**(): *Metadata[]*

*Defined in [core/src/main/index.ts:179](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L179)*

**Returns:** *Metadata[]*

___

###  name

• **get name**(): *string*

*Defined in [core/src/main/index.ts:183](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L183)*

**Returns:** *string*

___

###  reaper

• **get reaper**(): *[Reaper](../interfaces/reaper.md) | void*

*Defined in [core/src/main/index.ts:187](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L187)*

**Returns:** *[Reaper](../interfaces/reaper.md) | void*

___

###  storeType

• **get storeType**(): *string*

*Defined in [core/src/main/index.ts:191](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L191)*

**Returns:** *string*

___

###  type

• **get type**(): *string*

*Defined in [core/src/main/index.ts:195](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L195)*

**Returns:** *string*

___

###  usedHeapSize

• **get usedHeapSize**(): *number*

*Defined in [core/src/main/index.ts:199](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L199)*

**Returns:** *number*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [core/src/main/index.ts:203](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L203)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string, `options`: object): *Promise‹boolean›*

*Defined in [core/src/main/index.ts:211](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L211)*

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

*Defined in [core/src/main/index.ts:233](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L233)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹[string, any][]›*

___

###  export

▸ **export**(`options`: [ExportOptions](../interfaces/exportoptions.md)): *Promise‹[ExportResult](../interfaces/exportresult.md)›*

*Defined in [core/src/main/index.ts:245](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L245)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ExportOptions](../interfaces/exportoptions.md) | {} |

**Returns:** *Promise‹[ExportResult](../interfaces/exportresult.md)›*

___

###  get

▸ **get**(`key`: string, `options`: object): *Promise‹any›*

*Defined in [core/src/main/index.ts:267](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L267)*

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

*Defined in [core/src/main/index.ts:289](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L289)*

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

▸ **import**(`options`: [ImportOptions](../interfaces/importoptions.md)): *Promise‹void›*

*Defined in [core/src/main/index.ts:314](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L314)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ImportOptions](../interfaces/importoptions.md) |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any, `options`: object): *Promise‹void›*

*Defined in [core/src/main/index.ts:341](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L341)*

**Parameters:**

▪ **key**: *string*

▪ **value**: *any*

▪`Default value`  **options**: *object*= {}

Name | Type |
------ | ------ |
`cacheHeaders?` | [CacheHeaders](../README.md#cacheheaders) |
`hash?` | undefined &#124; false &#124; true |
`tag?` | any |

**Returns:** *Promise‹void›*

___

###  size

▸ **size**(): *Promise‹number›*

*Defined in [core/src/main/index.ts:367](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L367)*

**Returns:** *Promise‹number›*

___

###  startBackup

▸ **startBackup**(): *void*

*Defined in [core/src/main/index.ts:375](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L375)*

**Returns:** *void*

___

###  stopBackup

▸ **stopBackup**(): *void*

*Defined in [core/src/main/index.ts:379](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L379)*

**Returns:** *void*

## Object literals

###  events

### ▪ **events**: *object*

*Defined in [core/src/main/index.ts:74](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L74)*

###  ENTRY_DELETED

• **ENTRY_DELETED**: *string* = "ENTRY_DELETED"

*Defined in [core/src/main/index.ts:75](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/main/index.ts#L75)*
