[@cachemap/redis](../README.md) > [RedisStore](../classes/redisstore.md)

# Class: RedisStore

## Hierarchy

**RedisStore**

## Implements

* `Store`

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
* [init](redisstore.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new RedisStore**(options: *[ConstructorOptions](../interfaces/constructoroptions.md)*): [RedisStore](redisstore.md)

*Defined in [main/index.ts:22](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L22)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| options | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** [RedisStore](redisstore.md)

___

## Properties

<a id="type"></a>

###  type

**● type**: *"redis"* = "redis"

*Defined in [main/index.ts:19](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L19)*

___

## Accessors

<a id="maxheapsize"></a>

###  maxHeapSize

getmaxHeapSize(): `number`

*Defined in [main/index.ts:34](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L34)*

**Returns:** `number`

___
<a id="name"></a>

###  name

getname(): `string`

*Defined in [main/index.ts:38](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L38)*

**Returns:** `string`

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `Promise`<`void`>

*Defined in [main/index.ts:42](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L42)*

**Returns:** `Promise`<`void`>

___
<a id="delete"></a>

###  delete

▸ **delete**(key: *`string`*): `Promise`<`boolean`>

*Defined in [main/index.ts:54](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L54)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `Promise`<`boolean`>

___
<a id="entries"></a>

###  entries

▸ **entries**(keys?: *`string`[]*): `Promise`<`Array`<[`string`, `any`]>>

*Defined in [main/index.ts:66](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L66)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` keys | `string`[] |

**Returns:** `Promise`<`Array`<[`string`, `any`]>>

___
<a id="get"></a>

###  get

▸ **get**(key: *`string`*): `Promise`<`any`>

*Defined in [main/index.ts:86](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L86)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `Promise`<`any`>

___
<a id="has"></a>

###  has

▸ **has**(key: *`string`*): `Promise`<`boolean`>

*Defined in [main/index.ts:98](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L98)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `Promise`<`boolean`>

___
<a id="import"></a>

###  import

▸ **import**(entries: *`Array`<[`string`, `any`]>*): `Promise`<`void`>

*Defined in [main/index.ts:110](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L110)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| entries | `Array`<[`string`, `any`]> |

**Returns:** `Promise`<`void`>

___
<a id="set"></a>

###  set

▸ **set**(key: *`string`*, value: *`any`*): `Promise`<`void`>

*Defined in [main/index.ts:128](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L128)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |
| value | `any` |

**Returns:** `Promise`<`void`>

___
<a id="size"></a>

###  size

▸ **size**(): `Promise`<`number`>

*Defined in [main/index.ts:140](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L140)*

**Returns:** `Promise`<`number`>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../interfaces/initoptions.md)*): `Promise`<[RedisStore](redisstore.md)>

*Defined in [main/index.ts:8](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/redis/src/main/index.ts#L8)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| options | [InitOptions](../interfaces/initoptions.md) |

**Returns:** `Promise`<[RedisStore](redisstore.md)>

___

