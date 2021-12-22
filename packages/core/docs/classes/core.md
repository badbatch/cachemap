[Documentation](../README.md) › [Core](core.md)

# Class: Core

## Hierarchy

* **Core**

## Index

### Constructors

* [constructor](core.md#constructor)

### Accessors

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

## Constructors

###  constructor

\+ **new Core**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[Core](core.md)*

*Defined in [main/index.ts:70](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[Core](core.md)*

## Accessors

###  metadata

• **get metadata**(): *[Metadata](../interfaces/metadata.md)[]*

*Defined in [main/index.ts:123](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L123)*

**Returns:** *[Metadata](../interfaces/metadata.md)[]*

___

###  name

• **get name**(): *string*

*Defined in [main/index.ts:127](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L127)*

**Returns:** *string*

___

###  reaper

• **get reaper**(): *[Reaper](../interfaces/reaper.md) | void*

*Defined in [main/index.ts:131](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L131)*

**Returns:** *[Reaper](../interfaces/reaper.md) | void*

___

###  storeType

• **get storeType**(): *string*

*Defined in [main/index.ts:135](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L135)*

**Returns:** *string*

___

###  type

• **get type**(): *string*

*Defined in [main/index.ts:139](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L139)*

**Returns:** *string*

___

###  usedHeapSize

• **get usedHeapSize**(): *number*

*Defined in [main/index.ts:143](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L143)*

**Returns:** *number*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [main/index.ts:147](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L147)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string, `options`: object): *Promise‹boolean›*

*Defined in [main/index.ts:155](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L155)*

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

*Defined in [main/index.ts:175](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L175)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹[string, any][]›*

___

###  export

▸ **export**(`options`: [ExportOptions](../interfaces/exportoptions.md)): *Promise‹[ExportResult](../interfaces/exportresult.md)›*

*Defined in [main/index.ts:187](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L187)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ExportOptions](../interfaces/exportoptions.md) | {} |

**Returns:** *Promise‹[ExportResult](../interfaces/exportresult.md)›*

___

###  get

▸ **get**(`key`: string, `options`: object): *Promise‹any›*

*Defined in [main/index.ts:207](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L207)*

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

*Defined in [main/index.ts:227](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L227)*

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

*Defined in [main/index.ts:250](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L250)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ImportOptions](../interfaces/importoptions.md) |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any, `options`: object): *Promise‹void›*

*Defined in [main/index.ts:275](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L275)*

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

*Defined in [main/index.ts:299](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/main/index.ts#L299)*

**Returns:** *Promise‹number›*
