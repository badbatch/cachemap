
@cachemap/core-worker
=====================

Installation
------------

```bash
yarn add @cachemap/core-worker
```

## Index

### Classes

* [CoreWorker](classes/coreworker.md)

### Interfaces

* [CommonOptions](interfaces/commonoptions.md)
* [ConstructorOptions](interfaces/constructoroptions.md)
* [CreateOptions](interfaces/createoptions.md)
* [InitOptions](interfaces/initoptions.md)
* [PostMessage](interfaces/postmessage.md)
* [PostMessageResult](interfaces/postmessageresult.md)

### Variables

* [CLEAR](#clear)
* [CREATE](#create)
* [DELETE](#delete)
* [ENTRIES](#entries)
* [EXPORT](#export)
* [GET](#get)
* [HAS](#has)
* [IMPORT](#import)
* [SET](#set)
* [SIZE](#size)
* [cachemap](#cachemap)

### Functions

* [filterProps](#filterprops)
* [requiresKey](#requireskey)

---

## Variables

<a id="clear"></a>

### `<Const>` CLEAR

**● CLEAR**: *"clear"* = "clear"

*Defined in [constants/index.ts:2](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/constants/index.ts#L2)*

___
<a id="create"></a>

### `<Const>` CREATE

**● CREATE**: *"create"* = "create"

*Defined in [constants/index.ts:1](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/constants/index.ts#L1)*

___
<a id="delete"></a>

### `<Const>` DELETE

**● DELETE**: *"delete"* = "delete"

*Defined in [constants/index.ts:3](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/constants/index.ts#L3)*

___
<a id="entries"></a>

### `<Const>` ENTRIES

**● ENTRIES**: *"entries"* = "entries"

*Defined in [constants/index.ts:4](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/constants/index.ts#L4)*

___
<a id="export"></a>

### `<Const>` EXPORT

**● EXPORT**: *"export"* = "export"

*Defined in [constants/index.ts:5](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/constants/index.ts#L5)*

___
<a id="get"></a>

### `<Const>` GET

**● GET**: *"get"* = "get"

*Defined in [constants/index.ts:6](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/constants/index.ts#L6)*

___
<a id="has"></a>

### `<Const>` HAS

**● HAS**: *"has"* = "has"

*Defined in [constants/index.ts:7](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/constants/index.ts#L7)*

___
<a id="import"></a>

### `<Const>` IMPORT

**● IMPORT**: *"import"* = "import"

*Defined in [constants/index.ts:8](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/constants/index.ts#L8)*

___
<a id="set"></a>

### `<Const>` SET

**● SET**: *"set"* = "set"

*Defined in [constants/index.ts:9](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/constants/index.ts#L9)*

___
<a id="size"></a>

### `<Const>` SIZE

**● SIZE**: *"size"* = "size"

*Defined in [constants/index.ts:10](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/constants/index.ts#L10)*

___
<a id="cachemap"></a>

### `<Let>` cachemap

**● cachemap**: *`Core`*

*Defined in [worker/index.ts:9](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/worker/index.ts#L9)*

___

## Functions

<a id="filterprops"></a>

###  filterProps

▸ **filterProps**(__namedParameters: *`object`*): `object`

*Defined in [worker/index.ts:11](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/worker/index.ts#L11)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| __namedParameters | `object` |

**Returns:** `object`

___
<a id="requireskey"></a>

###  requiresKey

▸ **requiresKey**(type: *`string`*): `boolean`

*Defined in [worker/index.ts:15](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/core-worker/src/worker/index.ts#L15)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| type | `string` |

**Returns:** `boolean`

___

