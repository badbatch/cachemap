[Documentation](../README.md) > [Store](../interfaces/store.md)

# Interface: Store

## Hierarchy

**Store**

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

---

## Properties

<a id="maxheapsize"></a>

###  maxHeapSize

**● maxHeapSize**: *`number`*

*Defined in [defs/index.ts:118](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L118)*

___
<a id="name"></a>

###  name

**● name**: *`string`*

*Defined in [defs/index.ts:119](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L119)*

___
<a id="type"></a>

###  type

**● type**: *`string`*

*Defined in [defs/index.ts:120](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L120)*

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `Promise`<`void`>

*Defined in [defs/index.ts:121](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L121)*

**Returns:** `Promise`<`void`>

___
<a id="delete"></a>

###  delete

▸ **delete**(key: *`string`*): `Promise`<`boolean`>

*Defined in [defs/index.ts:122](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L122)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `Promise`<`boolean`>

___
<a id="entries"></a>

###  entries

▸ **entries**(keys?: *`string`[]*): `Promise`<`Array`<[`string`, `any`]>>

*Defined in [defs/index.ts:123](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L123)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` keys | `string`[] |

**Returns:** `Promise`<`Array`<[`string`, `any`]>>

___
<a id="get"></a>

###  get

▸ **get**(key: *`string`*): `Promise`<`any`>

*Defined in [defs/index.ts:124](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L124)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `Promise`<`any`>

___
<a id="has"></a>

###  has

▸ **has**(key: *`string`*): `Promise`<`boolean`>

*Defined in [defs/index.ts:125](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L125)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `Promise`<`boolean`>

___
<a id="import"></a>

###  import

▸ **import**(entries: *`Array`<[`string`, `any`]>*): `Promise`<`void`>

*Defined in [defs/index.ts:126](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L126)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| entries | `Array`<[`string`, `any`]> |

**Returns:** `Promise`<`void`>

___
<a id="set"></a>

###  set

▸ **set**(key: *`string`*, value: *`any`*): `Promise`<`void`>

*Defined in [defs/index.ts:127](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L127)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| key | `string` |
| value | `any` |

**Returns:** `Promise`<`void`>

___
<a id="size"></a>

###  size

▸ **size**(): `Promise`<`number`>

*Defined in [defs/index.ts:128](https://github.com/badbatch/cachemap/blob/412f22b/packages/core/src/defs/index.ts#L128)*

**Returns:** `Promise`<`number`>

___

