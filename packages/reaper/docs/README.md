
@cachemap/reaper
================

Installation
------------

```bash
yarn add @cachemap/reaper
```

## Index

### Classes

* [Reaper](classes/reaper.md)

### Interfaces

* [Callbacks](interfaces/callbacks.md)
* [ConstructorOptions](interfaces/constructoroptions.md)
* [Options](interfaces/options.md)

### Type aliases

* [DeleteCallback](#deletecallback)
* [Init](#init)
* [MetadataCallback](#metadatacallback)

### Functions

* [init](#init)

---

## Type aliases

<a id="deletecallback"></a>

###  DeleteCallback

**Ƭ DeleteCallback**: *`function`*

*Defined in [defs/index.ts:15](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/reaper/src/defs/index.ts#L15)*

#### Type declaration
▸(key: *`string`*, options?: * `undefined` &#124; `object`*): `Promise`<`boolean`>

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `string` |
| `Optional` options |  `undefined` &#124; `object`|

**Returns:** `Promise`<`boolean`>

___
<a id="init"></a>

###  Init

**Ƭ Init**: *`function`*

*Defined in [defs/index.ts:17](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/reaper/src/defs/index.ts#L17)*

#### Type declaration
▸(callbacks: *[Callbacks](interfaces/callbacks.md)*): [Reaper](classes/reaper.md)

**Parameters:**

| Param | Type |
| ------ | ------ |
| callbacks | [Callbacks](interfaces/callbacks.md) |

**Returns:** [Reaper](classes/reaper.md)

___
<a id="metadatacallback"></a>

###  MetadataCallback

**Ƭ MetadataCallback**: *`function`*

*Defined in [defs/index.ts:19](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/reaper/src/defs/index.ts#L19)*

#### Type declaration
▸(): `Metadata`[]

**Returns:** `Metadata`[]

___

## Functions

<a id="init"></a>

###  init

▸ **init**(options?: *[Options](interfaces/options.md)*): [Init](#init)

*Defined in [main/index.ts:70](https://github.com/dylanaubrey/cachemap/blob/2a8e078/packages/reaper/src/main/index.ts#L70)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` options | [Options](interfaces/options.md) |  {} |

**Returns:** [Init](#init)

___

