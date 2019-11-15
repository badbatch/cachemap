[Documentation](../README.md) › [Store](store.md)

# Interface: Store

## Hierarchy

* **Store**

## Index

### Properties

* [maxHeapSize](store.md#maxheapsize)
* [name](store.md#name)
* [type](store.md#type)

### Methods

* [clear](store.md#clear)
* [delete](store.md#delete)
* [entries](store.md#entries)
* [get](store.md#get)
* [has](store.md#has)
* [import](store.md#import)
* [set](store.md#set)
* [size](store.md#size)

## Properties

###  maxHeapSize

• **maxHeapSize**: *number*

*Defined in [types.ts:118](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L118)*

___

###  name

• **name**: *string*

*Defined in [types.ts:119](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L119)*

___

###  type

• **type**: *string*

*Defined in [types.ts:120](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L120)*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [types.ts:121](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L121)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string): *Promise‹boolean›*

*Defined in [types.ts:122](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L122)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  entries

▸ **entries**(`keys?`: string[]): *Promise‹Array‹[string, any]››*

*Defined in [types.ts:123](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹Array‹[string, any]››*

___

###  get

▸ **get**(`key`: string): *Promise‹any›*

*Defined in [types.ts:124](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L124)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹any›*

___

###  has

▸ **has**(`key`: string): *Promise‹boolean›*

*Defined in [types.ts:125](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L125)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  import

▸ **import**(`entries`: Array‹[string, any]›): *Promise‹void›*

*Defined in [types.ts:126](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L126)*

**Parameters:**

Name | Type |
------ | ------ |
`entries` | Array‹[string, any]› |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any): *Promise‹void›*

*Defined in [types.ts:127](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L127)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *Promise‹void›*

___

###  size

▸ **size**(): *Promise‹number›*

*Defined in [types.ts:128](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/core/src/types.ts#L128)*

**Returns:** *Promise‹number›*
