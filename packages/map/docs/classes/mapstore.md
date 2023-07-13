[Documentation](../README.md) › [MapStore](mapstore.md)

# Class: MapStore

## Hierarchy

* **MapStore**

## Implements

* Store

## Index

### Constructors

* [constructor](mapstore.md#constructor)

### Properties

* [type](mapstore.md#type)

### Accessors

* [maxHeapSize](mapstore.md#maxheapsize)
* [name](mapstore.md#name)

### Methods

* [clear](mapstore.md#clear)
* [delete](mapstore.md#delete)
* [entries](mapstore.md#entries)
* [get](mapstore.md#get)
* [has](mapstore.md#has)
* [import](mapstore.md#import)
* [set](mapstore.md#set)
* [size](mapstore.md#size)
* [init](mapstore.md#static-init)

## Constructors

###  constructor

\+ **new MapStore**(`options`: [ConstructorOptions](../README.md#constructoroptions)): *[MapStore](mapstore.md)*

*Defined in [main/index.ts:13](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../README.md#constructoroptions) |

**Returns:** *[MapStore](mapstore.md)*

## Properties

###  type

• **type**: *"map"* = "map"

*Defined in [main/index.ts:10](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L10)*

## Accessors

###  maxHeapSize

• **get maxHeapSize**(): *number*

*Defined in [main/index.ts:23](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L23)*

**Returns:** *number*

___

###  name

• **get name**(): *string*

*Defined in [main/index.ts:27](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L27)*

**Returns:** *string*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [main/index.ts:31](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L31)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string): *Promise‹boolean›*

*Defined in [main/index.ts:35](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  entries

▸ **entries**(`keys?`: string[]): *Promise‹[string, any][]›*

*Defined in [main/index.ts:39](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L39)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹[string, any][]›*

___

###  get

▸ **get**(`key`: string): *Promise‹any›*

*Defined in [main/index.ts:52](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L52)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹any›*

___

###  has

▸ **has**(`key`: string): *Promise‹boolean›*

*Defined in [main/index.ts:56](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L56)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  import

▸ **import**(`entries`: [string, any][]): *Promise‹void›*

*Defined in [main/index.ts:60](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L60)*

**Parameters:**

Name | Type |
------ | ------ |
`entries` | [string, any][] |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any): *Promise‹void›*

*Defined in [main/index.ts:64](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *Promise‹void›*

___

###  size

▸ **size**(): *Promise‹number›*

*Defined in [main/index.ts:68](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L68)*

**Returns:** *Promise‹number›*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../interfaces/initoptions.md)): *Promise‹[MapStore](mapstore.md)›*

*Defined in [main/index.ts:6](https://github.com/badbatch/cachemap/blob/f503e0e/packages/map/src/main/index.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *Promise‹[MapStore](mapstore.md)›*
