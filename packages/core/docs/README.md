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
* [MethodName](README.md#methodname)
* [ReaperInit](README.md#reaperinit)
* [RequestQueue](README.md#requestqueue)
* [StoreInit](README.md#storeinit)

### Variables

* [DEFAULT_MAX_HEAP_SIZE](README.md#const-default_max_heap_size)

### Functions

* [rehydrateMetadata](README.md#rehydratemetadata)

## Type aliases

###  CacheHeaders

Ƭ **CacheHeaders**: *Headers | object*

*Defined in [types.ts:62](https://github.com/badbatch/cachemap/blob/34d12b9/packages/core/src/types.ts#L62)*

___

###  MethodName

Ƭ **MethodName**: *"clear" | "delete" | "entries" | "export" | "get" | "has" | "import" | "set" | "size"*

*Defined in [types.ts:113](https://github.com/badbatch/cachemap/blob/34d12b9/packages/core/src/types.ts#L113)*

___

###  ReaperInit

Ƭ **ReaperInit**: *function*

*Defined in [types.ts:111](https://github.com/badbatch/cachemap/blob/34d12b9/packages/core/src/types.ts#L111)*

#### Type declaration:

▸ (`callbacks`: [ReaperCallbacks](interfaces/reapercallbacks.md)): *[Reaper](interfaces/reaper.md)*

**Parameters:**

Name | Type |
------ | ------ |
`callbacks` | [ReaperCallbacks](interfaces/reapercallbacks.md) |

___

###  RequestQueue

Ƭ **RequestQueue**: *Array‹[function, [MethodName](README.md#methodname), any[]]›*

*Defined in [types.ts:115](https://github.com/badbatch/cachemap/blob/34d12b9/packages/core/src/types.ts#L115)*

___

###  StoreInit

Ƭ **StoreInit**: *function*

*Defined in [types.ts:135](https://github.com/badbatch/cachemap/blob/34d12b9/packages/core/src/types.ts#L135)*

#### Type declaration:

▸ (`options`: [StoreOptions](interfaces/storeoptions.md)): *Promise‹[Store](interfaces/store.md)›*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [StoreOptions](interfaces/storeoptions.md) |

## Variables

### `Const` DEFAULT_MAX_HEAP_SIZE

• **DEFAULT_MAX_HEAP_SIZE**: *4194304* = 4194304

*Defined in [constants.ts:1](https://github.com/badbatch/cachemap/blob/34d12b9/packages/core/src/constants.ts#L1)*

## Functions

###  rehydrateMetadata

▸ **rehydrateMetadata**(`metadata`: [DehydratedMetadata](interfaces/dehydratedmetadata.md)[]): *[Metadata](interfaces/metadata.md)[]*

*Defined in [helpers/rehydrate-metadata/index.ts:4](https://github.com/badbatch/cachemap/blob/34d12b9/packages/core/src/helpers/rehydrate-metadata/index.ts#L4)*

**Parameters:**

Name | Type |
------ | ------ |
`metadata` | [DehydratedMetadata](interfaces/dehydratedmetadata.md)[] |

**Returns:** *[Metadata](interfaces/metadata.md)[]*
