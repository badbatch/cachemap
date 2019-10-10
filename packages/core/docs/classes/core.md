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
* [init](core.md#static-init)

## Constructors

###  constructor

\+ **new Core**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[Core](core.md)*

*Defined in [main/index.ts:85](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L85)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[Core](core.md)*

## Accessors

###  metadata

• **get metadata**(): *[Metadata](../interfaces/metadata.md)[]*

*Defined in [main/index.ts:110](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L110)*

**Returns:** *[Metadata](../interfaces/metadata.md)[]*

___

###  name

• **get name**(): *string*

*Defined in [main/index.ts:114](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L114)*

**Returns:** *string*

___

###  storeType

• **get storeType**(): *string*

*Defined in [main/index.ts:118](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L118)*

**Returns:** *string*

___

###  usedHeapSize

• **get usedHeapSize**(): *number*

*Defined in [main/index.ts:122](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L122)*

**Returns:** *number*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [main/index.ts:126](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L126)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string, `options`: object): *Promise‹boolean›*

*Defined in [main/index.ts:137](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L137)*

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

*Defined in [main/index.ts:157](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L157)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹Array‹[string, any]››*

___

###  export

▸ **export**(`options`: [ExportOptions](../interfaces/exportoptions.md)): *Promise‹[ExportResult](../interfaces/exportresult.md)›*

*Defined in [main/index.ts:169](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L169)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ExportOptions](../interfaces/exportoptions.md) |  {} |

**Returns:** *Promise‹[ExportResult](../interfaces/exportresult.md)›*

___

###  get

▸ **get**(`key`: string, `options`: object): *Promise‹any›*

*Defined in [main/index.ts:189](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L189)*

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

*Defined in [main/index.ts:209](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L209)*

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

*Defined in [main/index.ts:232](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L232)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ImportOptions](../interfaces/importoptions.md) |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any, `options`: object): *Promise‹void›*

*Defined in [main/index.ts:257](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L257)*

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

*Defined in [main/index.ts:281](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L281)*

**Returns:** *Promise‹number›*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../interfaces/initoptions.md)): *Promise‹[Core](core.md)›*

*Defined in [main/index.ts:20](https://github.com/badbatch/cachemap/blob/00de699/packages/core/src/main/index.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *Promise‹[Core](core.md)›*
