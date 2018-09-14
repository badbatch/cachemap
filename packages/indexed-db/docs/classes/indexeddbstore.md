[@cachemap/indexed-db](../README.md) > [IndexedDBStore](../classes/indexeddbstore.md)

# Class: IndexedDBStore

## Hierarchy

**IndexedDBStore**

## Implements

* `Store`

## Index

### Constructors

* [constructor](indexeddbstore.md#constructor)

### Properties

* [type](indexeddbstore.md#type)

### Accessors

* [maxHeapSize](indexeddbstore.md#maxheapsize)
* [name](indexeddbstore.md#name)

### Methods

* [clear](indexeddbstore.md#clear)
* [delete](indexeddbstore.md#delete)
* [entries](indexeddbstore.md#entries)
* [get](indexeddbstore.md#get)
* [has](indexeddbstore.md#has)
* [import](indexeddbstore.md#import)
* [set](indexeddbstore.md#set)
* [size](indexeddbstore.md#size)
* [init](indexeddbstore.md#init)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new IndexedDBStore**(options: *[ConstructorOptions](../interfaces/constructoroptions.md)*): [IndexedDBStore](indexeddbstore.md)

*Defined in [main/index.ts:28](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L28)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| options | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** [IndexedDBStore](indexeddbstore.md)

___

## Properties

<a id="type"></a>

###  type

**● type**: *"indexedDB"* = "indexedDB"

*Defined in [main/index.ts:25](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L25)*

___

## Accessors

<a id="maxheapsize"></a>

###  maxHeapSize

getmaxHeapSize(): `number`

*Defined in [main/index.ts:40](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L40)*

**Returns:** `number`

___
<a id="name"></a>

###  name

getname(): `string`

*Defined in [main/index.ts:44](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L44)*

**Returns:** `string`

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `Promise`<`void`>

*Defined in [main/index.ts:48](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L48)*

**Returns:** `Promise`<`void`>

___
<a id="delete"></a>

###  delete

▸ **delete**(key: *`string`*): `Promise`<`boolean`>

*Defined in [main/index.ts:58](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L58)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `Promise`<`boolean`>

___
<a id="entries"></a>

###  entries

▸ **entries**(keys?: *`string`[]*): `Promise`<`Array`<[`string`, `any`]>>

*Defined in [main/index.ts:70](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L70)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` keys | `string`[] |

**Returns:** `Promise`<`Array`<[`string`, `any`]>>

___
<a id="get"></a>

###  get

▸ **get**(key: *`string`*): `Promise`<`any`>

*Defined in [main/index.ts:97](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L97)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `Promise`<`any`>

___
<a id="has"></a>

###  has

▸ **has**(key: *`string`*): `Promise`<`boolean`>

*Defined in [main/index.ts:106](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L106)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |

**Returns:** `Promise`<`boolean`>

___
<a id="import"></a>

###  import

▸ **import**(entries: *`Array`<[`string`, `any`]>*): `Promise`<`void`>

*Defined in [main/index.ts:115](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L115)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| entries | `Array`<[`string`, `any`]> |

**Returns:** `Promise`<`void`>

___
<a id="set"></a>

###  set

▸ **set**(key: *`string`*, value: *`any`*): `Promise`<`void`>

*Defined in [main/index.ts:125](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L125)*

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

*Defined in [main/index.ts:135](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L135)*

**Returns:** `Promise`<`number`>

___
<a id="init"></a>

### `<Static>` init

▸ **init**(options: *[InitOptions](../interfaces/initoptions.md)*): `Promise`<[IndexedDBStore](indexeddbstore.md)>

*Defined in [main/index.ts:7](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/indexed-db/src/main/index.ts#L7)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| options | [InitOptions](../interfaces/initoptions.md) |

**Returns:** `Promise`<[IndexedDBStore](indexeddbstore.md)>

___

