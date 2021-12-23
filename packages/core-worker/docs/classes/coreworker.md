[Documentation](../README.md) › [CoreWorker](coreworker.md)

# Class: CoreWorker

## Hierarchy

* **CoreWorker**

## Index

### Constructors

* [constructor](coreworker.md#constructor)

### Accessors

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

## Constructors

###  constructor

\+ **new CoreWorker**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[CoreWorker](coreworker.md)*

*Defined in [main/index.ts:38](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[CoreWorker](coreworker.md)*

## Accessors

###  metadata

• **get metadata**(): *Metadata[]*

*Defined in [main/index.ts:68](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L68)*

**Returns:** *Metadata[]*

___

###  name

• **get name**(): *string*

*Defined in [main/index.ts:72](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L72)*

**Returns:** *string*

___

###  storeType

• **get storeType**(): *string | undefined*

*Defined in [main/index.ts:76](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L76)*

**Returns:** *string | undefined*

___

###  type

• **get type**(): *string*

*Defined in [main/index.ts:80](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L80)*

**Returns:** *string*

___

###  usedHeapSize

• **get usedHeapSize**(): *number*

*Defined in [main/index.ts:84](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L84)*

**Returns:** *number*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [main/index.ts:88](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L88)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string, `options`: object): *Promise‹boolean›*

*Defined in [main/index.ts:97](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L97)*

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

*Defined in [main/index.ts:107](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L107)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹[string, any][]›*

___

###  export

▸ **export**(`options`: ExportOptions): *Promise‹ExportResult›*

*Defined in [main/index.ts:117](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L117)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | ExportOptions | {} |

**Returns:** *Promise‹ExportResult›*

___

###  get

▸ **get**(`key`: string, `options`: object): *Promise‹any›*

*Defined in [main/index.ts:127](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L127)*

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

*Defined in [main/index.ts:137](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L137)*

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

*Defined in [main/index.ts:151](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L151)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | ImportOptions |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any, `options`: object): *Promise‹any›*

*Defined in [main/index.ts:160](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L160)*

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

*Defined in [main/index.ts:173](https://github.com/badbatch/cachemap/blob/b180798/packages/core-worker/src/main/index.ts#L173)*

**Returns:** *Promise‹number›*
