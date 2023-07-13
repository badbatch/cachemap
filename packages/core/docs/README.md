[Documentation](README.md)

# Documentation

## Index

### Classes

* [Core](classes/core.md)

### Interfaces

* [BaseOptions](interfaces/baseoptions.md)
* [ConstructorOptions](interfaces/constructoroptions.md)
* [DehydratedMetadata](interfaces/dehydratedmetadata.md)
* [ExportOptions](interfaces/exportoptions.md)
* [ExportResult](interfaces/exportresult.md)
* [ImportOptions](interfaces/importoptions.md)
* [PlainObject](interfaces/plainobject.md)
* [Reaper](interfaces/reaper.md)
* [ReaperCallbacks](interfaces/reapercallbacks.md)

### Type aliases

* [CacheHeaders](README.md#cacheheaders)
* [ControllerEvent](README.md#controllerevent)
* [FilterByValue](README.md#filterbyvalue)
* [MethodName](README.md#methodname)
* [ReaperInit](README.md#reaperinit)
* [RequestQueue](README.md#requestqueue)

### Variables

* [DEFAULT_BACKUP_INTERVAL](README.md#const-default_backup_interval)
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

*Defined in [core/src/types.ts:63](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L63)*

___

###  ControllerEvent

Ƭ **ControllerEvent**: *object*

*Defined in [core/src/types.ts:75](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L75)*

#### Type declaration:

* **name**? : *undefined | string*

* **type**? : *undefined | string*

___

###  FilterByValue

Ƭ **FilterByValue**: *object*

*Defined in [core/src/types.ts:73](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L73)*

#### Type declaration:

* **comparator**: *any*

* **keyChain**: *string*

___

###  MethodName

Ƭ **MethodName**: *"clear" | "delete" | "entries" | "export" | "get" | "has" | "import" | "set" | "size"*

*Defined in [core/src/types.ts:113](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L113)*

___

###  ReaperInit

Ƭ **ReaperInit**: *function*

*Defined in [core/src/types.ts:111](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L111)*

#### Type declaration:

▸ (`callbacks`: [ReaperCallbacks](interfaces/reapercallbacks.md)): *[Reaper](interfaces/reaper.md)*

**Parameters:**

Name | Type |
------ | ------ |
`callbacks` | [ReaperCallbacks](interfaces/reapercallbacks.md) |

___

###  RequestQueue

Ƭ **RequestQueue**: *[function, [MethodName](README.md#methodname), any[]][]*

*Defined in [core/src/types.ts:115](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L115)*

## Variables

### `Const` DEFAULT_BACKUP_INTERVAL

• **DEFAULT_BACKUP_INTERVAL**: *10000* = 10000

*Defined in [core/src/constants.ts:2](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/constants.ts#L2)*

___

### `Const` DEFAULT_MAX_HEAP_SIZE

• **DEFAULT_MAX_HEAP_SIZE**: *4194304* = 4194304

*Defined in [core/src/constants.ts:1](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/constants.ts#L1)*

## Functions

### `Const` decode

▸ **decode**(`encodedData`: string): *any*

*Defined in [core/src/helpers/base64/index.ts:6](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/helpers/base64/index.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`encodedData` | string |

**Returns:** *any*

___

### `Const` decrypt

▸ **decrypt**(`encryptedData`: string, `secret`: string): *any*

*Defined in [core/src/helpers/encryption/index.ts:6](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/helpers/encryption/index.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`encryptedData` | string |
`secret` | string |

**Returns:** *any*

___

### `Const` encode

▸ **encode**(`data`: JsonValue): *string*

*Defined in [core/src/helpers/base64/index.ts:4](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/helpers/base64/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | JsonValue |

**Returns:** *string*

___

### `Const` encrypt

▸ **encrypt**(`data`: JsonValue, `secret`: string): *string*

*Defined in [core/src/helpers/encryption/index.ts:4](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/helpers/encryption/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | JsonValue |
`secret` | string |

**Returns:** *string*

___

###  rehydrateMetadata

▸ **rehydrateMetadata**(`metadata`: [DehydratedMetadata](interfaces/dehydratedmetadata.md)[]): *Metadata[]*

*Defined in [core/src/helpers/rehydrate-metadata/index.ts:5](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/helpers/rehydrate-metadata/index.ts#L5)*

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | [DehydratedMetadata](interfaces/dehydratedmetadata.md)[] |

**Returns:** *Metadata[]*
