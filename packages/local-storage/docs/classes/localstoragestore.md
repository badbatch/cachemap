[Documentation](../README.md) › [LocalStorageStore](localstoragestore.md)

# Class: LocalStorageStore

## Hierarchy

* **LocalStorageStore**

## Implements

* Store

## Index

### Constructors

* [constructor](localstoragestore.md#constructor)

### Properties

* [type](localstoragestore.md#type)

### Accessors

* [maxHeapSize](localstoragestore.md#maxheapsize)
* [name](localstoragestore.md#name)

### Methods

* [clear](localstoragestore.md#clear)
* [delete](localstoragestore.md#delete)
* [entries](localstoragestore.md#entries)
* [get](localstoragestore.md#get)
* [has](localstoragestore.md#has)
* [import](localstoragestore.md#import)
* [set](localstoragestore.md#set)
* [size](localstoragestore.md#size)
* [init](localstoragestore.md#static-init)

## Constructors

###  constructor

\+ **new LocalStorageStore**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[LocalStorageStore](localstoragestore.md)*

*Defined in [main/index.ts:13](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[LocalStorageStore](localstoragestore.md)*

## Properties

###  type

• **type**: *"localStorage"* = "localStorage"

*Defined in [main/index.ts:10](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L10)*

## Accessors

###  maxHeapSize

• **get maxHeapSize**(): *number*

*Defined in [main/index.ts:23](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L23)*

**Returns:** *number*

___

###  name

• **get name**(): *string*

*Defined in [main/index.ts:27](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L27)*

**Returns:** *string*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [main/index.ts:31](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L31)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string): *Promise‹boolean›*

*Defined in [main/index.ts:42](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L42)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  entries

▸ **entries**(`keys?`: string[]): *Promise‹[string, any][]›*

*Defined in [main/index.ts:53](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹[string, any][]›*

___

###  get

▸ **get**(`key`: string): *Promise‹any›*

*Defined in [main/index.ts:87](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹any›*

___

###  has

▸ **has**(`key`: string): *Promise‹boolean›*

*Defined in [main/index.ts:96](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  import

▸ **import**(`entries`: [string, any][]): *Promise‹void›*

*Defined in [main/index.ts:104](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L104)*

**Parameters:**

Name | Type |
------ | ------ |
`entries` | [string, any][] |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any): *Promise‹void›*

*Defined in [main/index.ts:114](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L114)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *Promise‹void›*

___

###  size

▸ **size**(): *Promise‹number›*

*Defined in [main/index.ts:122](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L122)*

**Returns:** *Promise‹number›*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../interfaces/initoptions.md)): *Promise‹[LocalStorageStore](localstoragestore.md)›*

*Defined in [main/index.ts:6](https://github.com/badbatch/cachemap/blob/6239088/packages/local-storage/src/main/index.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *Promise‹[LocalStorageStore](localstoragestore.md)›*
