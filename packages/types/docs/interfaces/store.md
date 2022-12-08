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

*Defined in [index.ts:64](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L64)*

___

###  name

• **name**: *string*

*Defined in [index.ts:65](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L65)*

___

###  type

• **type**: *string*

*Defined in [index.ts:66](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L66)*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [index.ts:67](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L67)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string): *Promise‹boolean›*

*Defined in [index.ts:68](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  entries

▸ **entries**(`keys?`: string[], `options?`: undefined | object): *Promise‹[string, any][]›*

*Defined in [index.ts:69](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |
`options?` | undefined &#124; object |

**Returns:** *Promise‹[string, any][]›*

___

###  get

▸ **get**(`key`: string): *Promise‹any›*

*Defined in [index.ts:70](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹any›*

___

###  has

▸ **has**(`key`: string): *Promise‹boolean›*

*Defined in [index.ts:71](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L71)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  import

▸ **import**(`entries`: [string, any][]): *Promise‹void›*

*Defined in [index.ts:72](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L72)*

**Parameters:**

Name | Type |
------ | ------ |
`entries` | [string, any][] |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any): *Promise‹void›*

*Defined in [index.ts:73](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L73)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *Promise‹void›*

___

###  size

▸ **size**(): *Promise‹number›*

*Defined in [index.ts:74](https://github.com/badbatch/cachemap/blob/8c9b61b/packages/types/src/index.ts#L74)*

**Returns:** *Promise‹number›*
