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

*Defined in [defs/index.ts:118](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L118)*

___

###  name

• **name**: *string*

*Defined in [defs/index.ts:119](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L119)*

___

###  type

• **type**: *string*

*Defined in [defs/index.ts:120](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L120)*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [defs/index.ts:121](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L121)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string): *Promise‹boolean›*

*Defined in [defs/index.ts:122](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L122)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  entries

▸ **entries**(`keys?`: string[]): *Promise‹[string, any][]›*

*Defined in [defs/index.ts:123](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹[string, any][]›*

___

###  get

▸ **get**(`key`: string): *Promise‹any›*

*Defined in [defs/index.ts:124](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L124)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹any›*

___

###  has

▸ **has**(`key`: string): *Promise‹boolean›*

*Defined in [defs/index.ts:125](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L125)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  import

▸ **import**(`entries`: [string, any][]): *Promise‹void›*

*Defined in [defs/index.ts:126](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L126)*

**Parameters:**

Name | Type |
------ | ------ |
`entries` | [string, any][] |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any): *Promise‹void›*

*Defined in [defs/index.ts:127](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L127)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *Promise‹void›*

___

###  size

▸ **size**(): *Promise‹number›*

*Defined in [defs/index.ts:128](https://github.com/badbatch/cachemap/blob/40e3bea/packages/core/src/defs/index.ts#L128)*

**Returns:** *Promise‹number›*
