[Documentation](../README.md) › [RedisStore](redisstore.md)

# Class: RedisStore

## Hierarchy

* **RedisStore**

## Implements

* Store

## Index

### Constructors

* [constructor](redisstore.md#constructor)

### Properties

* [type](redisstore.md#type)

### Accessors

* [maxHeapSize](redisstore.md#maxheapsize)
* [name](redisstore.md#name)

### Methods

* [clear](redisstore.md#clear)
* [delete](redisstore.md#delete)
* [entries](redisstore.md#entries)
* [get](redisstore.md#get)
* [has](redisstore.md#has)
* [import](redisstore.md#import)
* [set](redisstore.md#set)
* [size](redisstore.md#size)
* [init](redisstore.md#static-init)

## Constructors

###  constructor

\+ **new RedisStore**(`options`: [ConstructorOptions](../interfaces/constructoroptions.md)): *[RedisStore](redisstore.md)*

*Defined in [main/index.ts:22](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L22)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[RedisStore](redisstore.md)*

## Properties

###  type

• **type**: *"redis"* = "redis"

*Defined in [main/index.ts:19](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L19)*

## Accessors

###  maxHeapSize

• **get maxHeapSize**(): *number*

*Defined in [main/index.ts:34](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L34)*

**Returns:** *number*

___

###  name

• **get name**(): *string*

*Defined in [main/index.ts:38](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L38)*

**Returns:** *string*

## Methods

###  clear

▸ **clear**(): *Promise‹void›*

*Defined in [main/index.ts:42](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L42)*

**Returns:** *Promise‹void›*

___

###  delete

▸ **delete**(`key`: string): *Promise‹boolean›*

*Defined in [main/index.ts:54](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  entries

▸ **entries**(`keys?`: string[]): *Promise‹Array‹[string, any]››*

*Defined in [main/index.ts:66](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *Promise‹Array‹[string, any]››*

___

###  get

▸ **get**(`key`: string): *Promise‹any›*

*Defined in [main/index.ts:86](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L86)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹any›*

___

###  has

▸ **has**(`key`: string): *Promise‹boolean›*

*Defined in [main/index.ts:98](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L98)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *Promise‹boolean›*

___

###  import

▸ **import**(`entries`: Array‹[string, any]›): *Promise‹void›*

*Defined in [main/index.ts:110](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L110)*

**Parameters:**

Name | Type |
------ | ------ |
`entries` | Array‹[string, any]› |

**Returns:** *Promise‹void›*

___

###  set

▸ **set**(`key`: string, `value`: any): *Promise‹void›*

*Defined in [main/index.ts:128](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *Promise‹void›*

___

###  size

▸ **size**(): *Promise‹number›*

*Defined in [main/index.ts:140](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L140)*

**Returns:** *Promise‹number›*

___

### `Static` init

▸ **init**(`options`: [InitOptions](../interfaces/initoptions.md)): *Promise‹[RedisStore](redisstore.md)›*

*Defined in [main/index.ts:8](https://github.com/badbatch/cachemap/blob/f68b2bf/packages/redis/src/main/index.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *Promise‹[RedisStore](redisstore.md)›*
