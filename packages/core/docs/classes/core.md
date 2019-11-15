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
* [storeType](core.md#storetype)
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

*Defined in [main/index.ts:63](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[Core](core.md)*

## Accessors

###  metadata

• **get metadata**(): *[Metadata](../interfaces/metadata.md)[]*

*Defined in [main/index.ts:104](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L104)*

**Returns:** *[Metadata](../interfaces/metadata.md)[]*

___

###  name

• **get name**(): *string*

*Defined in [main/index.ts:108](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L108)*

**Returns:** *string*

___

###  storeType

• **get storeType**(): *string*

*Defined in [main/index.ts:112](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L112)*

**Returns:** *string*

___

###  usedHeapSize

• **get usedHeapSize**(): *number*

*Defined in [main/index.ts:116](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L116)*

**Returns:** *number*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [main/index.ts:120](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L120)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string, `options`: object): *Promise‹boolean›*

*Defined in [main/index.ts:128](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L128)*

**Parameters:**

▪ **key**: *string*

▪`Default value`  **options**: *object*=  {}

Name | Type |
------ | ------ |
`hash?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹boolean›*

___

###  entries

▸ **entries**(`keys?`: string[]): *Promise‹Array‹[string, any]››*

*Defined in [main/index.ts:148](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L148)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹Array‹[string, any]››*

___

###  export

▸ **export**(`options`: [ExportOptions](../interfaces/exportoptions.md)): *Promise‹[ExportResult](../interfaces/exportresult.md)›*

*Defined in [main/index.ts:160](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L160)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ExportOptions](../interfaces/exportoptions.md) |  {} |

**Returns:** *Promise‹[ExportResult](../interfaces/exportresult.md)›*

___

###  get

▸ **get**(`key`: string, `options`: object): *Promise‹any›*

*Defined in [main/index.ts:180](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L180)*

**Parameters:**

▪ **key**: *string*

▪`Default value`  **options**: *object*=  {}

Name | Type |
------ | ------ |
`hash?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹any›*

___

###  has

▸ **has**(`key`: string, `options`: object): *Promise‹false | Cacheability›*

*Defined in [main/index.ts:200](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L200)*

**Parameters:**

▪ **key**: *string*

▪`Default value`  **options**: *object*=  {}

Name | Type |
------ | ------ |
`deleteExpired?` | undefined &#124; false &#124; true |
`hash?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹false | Cacheability›*

___

###  import

▸ **import**(`options`: [ImportOptions](../interfaces/importoptions.md)): *Promise‹void›*

*Defined in [main/index.ts:223](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L223)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ImportOptions](../interfaces/importoptions.md) |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any, `options`: object): *Promise‹void›*

*Defined in [main/index.ts:248](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L248)*

**Parameters:**

▪ **key**: *string*

▪ **value**: *any*

▪`Default value`  **options**: *object*=  {}

Name | Type |
------ | ------ |
`cacheHeaders?` | [CacheHeaders](../README.md#cacheheaders) |
`hash?` | undefined &#124; false &#124; true |
`tag?` | any |

**Returns:** *Promise‹void›*

___

###  size

▸ **size**(): *Promise‹number›*

*Defined in [main/index.ts:272](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/main/index.ts#L272)*

**Returns:** *Promise‹number›*
