[Documentation](../README.md) › [CoreWorker](coreworker.md)

# Class: CoreWorker

## Hierarchy

* **CoreWorker**

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

## Constructors

###  constructor

\+ **new CoreWorker**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[CoreWorker](coreworker.md)*

*Defined in [main/index.ts:21](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[CoreWorker](coreworker.md)*

## Accessors

###  metadata

• **get metadata**(): *Metadata[]*

*Defined in [main/index.ts:40](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L40)*

**Returns:** *Metadata[]*

___

###  storeType

• **get storeType**(): *string | undefined*

*Defined in [main/index.ts:44](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L44)*

**Returns:** *string | undefined*

___

###  usedHeapSize

• **get usedHeapSize**(): *number*

*Defined in [main/index.ts:48](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L48)*

**Returns:** *number*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [main/index.ts:52](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L52)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string, `options`: object): *Promise‹boolean›*

*Defined in [main/index.ts:61](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L61)*

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

*Defined in [main/index.ts:71](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹[string, any][]›*

___

###  export

▸ **export**(`options`: ExportOptions): *Promise‹ExportResult›*

*Defined in [main/index.ts:81](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L81)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | ExportOptions | {} |

**Returns:** *Promise‹ExportResult›*

___

###  get

▸ **get**(`key`: string, `options`: object): *Promise‹any›*

*Defined in [main/index.ts:91](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L91)*

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

*Defined in [main/index.ts:101](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L101)*

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

*Defined in [main/index.ts:115](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L115)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | ImportOptions |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any, `options`: object): *Promise‹any›*

*Defined in [main/index.ts:124](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L124)*

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

*Defined in [main/index.ts:137](https://github.com/badbatch/cachemap/blob/78d1a97/packages/core-worker/src/main/index.ts#L137)*

**Returns:** *Promise‹number›*
