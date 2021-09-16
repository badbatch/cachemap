[Documentation](README.md)

# Documentation

## Index

### Classes

* [Core](classes/core.md)

### Interfaces

* [BaseMetadata](interfaces/basemetadata.md)
* [BaseOptions](interfaces/baseoptions.md)
* [ConstructorOptions](interfaces/constructoroptions.md)
* [DehydratedMetadata](interfaces/dehydratedmetadata.md)
* [ExportOptions](interfaces/exportoptions.md)
* [ExportResult](interfaces/exportresult.md)
* [ImportOptions](interfaces/importoptions.md)
* [Metadata](interfaces/metadata.md)
* [PlainObject](interfaces/plainobject.md)
* [Reaper](interfaces/reaper.md)
* [ReaperCallbacks](interfaces/reapercallbacks.md)
* [Store](interfaces/store.md)
* [StoreOptions](interfaces/storeoptions.md)

### Type aliases

* [CacheHeaders](README.md#cacheheaders)
* [FilterByValue](README.md#filterbyvalue)
* [MethodName](README.md#methodname)
* [ReaperInit](README.md#reaperinit)
* [RequestQueue](README.md#requestqueue)
* [StoreInit](README.md#storeinit)

### Variables

* [DEFAULT_MAX_HEAP_SIZE](README.md#const-default_max_heap_size)

### Functions

* [decode](README.md#const-decode)
* [decrypt](README.md#const-decrypt)
* [encode](README.md#const-encode)
* [encrypt](README.md#const-encrypt)
* [rehydrateMetadata](README.md#rehydratemetadata)

## Type aliases

###  CacheHeaders

Ƭ **CacheHeaders**: *Headers | object*

*Defined in [types.ts:63](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/types.ts#L63)*

___

###  FilterByValue

Ƭ **FilterByValue**: *object*

*Defined in [types.ts:73](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/types.ts#L73)*

#### Type declaration:

* **comparator**: *any*

* **keyChain**: *string*

___

###  MethodName

Ƭ **MethodName**: *"clear" | "delete" | "entries" | "export" | "get" | "has" | "import" | "set" | "size"*

*Defined in [types.ts:117](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/types.ts#L117)*

___

###  ReaperInit

Ƭ **ReaperInit**: *function*

*Defined in [types.ts:115](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/types.ts#L115)*

#### Type declaration:

▸ (`callbacks`: [ReaperCallbacks](interfaces/reapercallbacks.md)): *[Reaper](interfaces/reaper.md)*

**Parameters:**

Name | Type |
------ | ------ |
`callbacks` | [ReaperCallbacks](interfaces/reapercallbacks.md) |

___

###  RequestQueue

Ƭ **RequestQueue**: *[function, [MethodName](README.md#methodname), any[]][]*

*Defined in [types.ts:119](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/types.ts#L119)*

___

###  StoreInit

Ƭ **StoreInit**: *function*

*Defined in [types.ts:139](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/types.ts#L139)*

#### Type declaration:

▸ (`options`: [StoreOptions](interfaces/storeoptions.md)): *Promise‹[Store](interfaces/store.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [StoreOptions](interfaces/storeoptions.md) |

## Variables

### `Const` DEFAULT_MAX_HEAP_SIZE

• **DEFAULT_MAX_HEAP_SIZE**: *4194304* = 4194304

*Defined in [constants.ts:1](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/constants.ts#L1)*

## Functions

### `Const` decode

▸ **decode**(`encodedData`: string): *any*

*Defined in [helpers/base64/index.ts:6](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/helpers/base64/index.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`encodedData` | string |

**Returns:** *any*

___

### `Const` decrypt

▸ **decrypt**(`encryptedData`: string, `secret`: string): *any*

*Defined in [helpers/encryption/index.ts:6](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/helpers/encryption/index.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`encryptedData` | string |
`secret` | string |

**Returns:** *any*

___

### `Const` encode

▸ **encode**(`data`: JsonValue): *string*

*Defined in [helpers/base64/index.ts:4](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/helpers/base64/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | JsonValue |

**Returns:** *string*

___

### `Const` encrypt

▸ **encrypt**(`data`: JsonValue, `secret`: string): *string*

*Defined in [helpers/encryption/index.ts:4](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/helpers/encryption/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | JsonValue |
`secret` | string |

**Returns:** *string*

___

###  rehydrateMetadata

▸ **rehydrateMetadata**(`metadata`: [DehydratedMetadata](interfaces/dehydratedmetadata.md)[]): *[Metadata](interfaces/metadata.md)[]*

*Defined in [helpers/rehydrate-metadata/index.ts:4](https://github.com/badbatch/cachemap/blob/28dde3d/packages/core/src/helpers/rehydrate-metadata/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | [DehydratedMetadata](interfaces/dehydratedmetadata.md)[] |

**Returns:** *[Metadata](interfaces/metadata.md)[]*
