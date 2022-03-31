[Documentation](../README.md) › [ConstructorOptions](constructoroptions.md)

# Interface: ConstructorOptions

## Hierarchy

* [BaseOptions](baseoptions.md)

  ↳ **ConstructorOptions**

## Index

### Properties

* [backupInterval](constructoroptions.md#optional-backupinterval)
* [backupStore](constructoroptions.md#optional-backupstore)
* [disableCacheInvalidation](constructoroptions.md#optional-disablecacheinvalidation)
* [encryptionSecret](constructoroptions.md#optional-encryptionsecret)
* [name](constructoroptions.md#name)
* [reaper](constructoroptions.md#optional-reaper)
* [sharedCache](constructoroptions.md#optional-sharedcache)
* [startBackup](constructoroptions.md#optional-startbackup)
* [store](constructoroptions.md#store)
* [type](constructoroptions.md#type)

### Methods

* [sortComparator](constructoroptions.md#optional-sortcomparator)

## Properties

### `Optional` backupInterval

• **backupInterval**? : *undefined | number*

*Inherited from [BaseOptions](baseoptions.md).[backupInterval](baseoptions.md#optional-backupinterval)*

*Defined in [core/src/types.ts:9](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L9)*

The time in milliseconds between back ups from a map store
to the provided persisted store.

___

### `Optional` backupStore

• **backupStore**? : *undefined | false | true*

*Inherited from [BaseOptions](baseoptions.md).[backupStore](baseoptions.md#optional-backupstore)*

*Defined in [core/src/types.ts:17](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L17)*

Whether to use store to back up to from a map store. If true,
the provided store is used to periodically back up to rather than
directly write to. This makes reading/writing much quicker, but
still gives you persistence across browser reloads or server
restarts. If true, the store should be a peristed store.

___

### `Optional` disableCacheInvalidation

• **disableCacheInvalidation**? : *undefined | false | true*

*Inherited from [BaseOptions](baseoptions.md).[disableCacheInvalidation](baseoptions.md#optional-disablecacheinvalidation)*

*Defined in [core/src/types.ts:23](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L23)*

Whether to disable the checking of a cache entry's TTL before
returning the entry. This also disabling the purging of stale
cache entries by the reaper, if one is configured.

___

### `Optional` encryptionSecret

• **encryptionSecret**? : *undefined | string*

*Inherited from [BaseOptions](baseoptions.md).[encryptionSecret](baseoptions.md#optional-encryptionsecret)*

*Defined in [core/src/types.ts:28](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L28)*

This is used to encrypt all entries. If a secret is provided,
all entries are encrypted.

___

###  name

• **name**: *string*

*Inherited from [BaseOptions](baseoptions.md).[name](baseoptions.md#name)*

*Defined in [core/src/types.ts:34](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L34)*

The name is primarily used as a target for the controller, in order
to centrally control the cachemap in an application with muliple
instances.

___

### `Optional` reaper

• **reaper**? : *[ReaperInit](../README.md#reaperinit)*

*Inherited from [BaseOptions](baseoptions.md).[reaper](baseoptions.md#optional-reaper)*

*Defined in [core/src/types.ts:39](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L39)*

The reaper is used to keep the cachemap size below user specified limits
by purging the least imporant entries in the cachemap.

___

### `Optional` sharedCache

• **sharedCache**? : *undefined | false | true*

*Inherited from [BaseOptions](baseoptions.md).[sharedCache](baseoptions.md#optional-sharedcache)*

*Defined in [core/src/types.ts:44](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L44)*

Whether the cache is shared. If true, entries with a cache control
header of "private" are not stored in the cachemap.

___

### `Optional` startBackup

• **startBackup**? : *undefined | false | true*

*Inherited from [BaseOptions](baseoptions.md).[startBackup](baseoptions.md#optional-startbackup)*

*Defined in [core/src/types.ts:49](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L49)*

Whether to start backing up store on initialisation. If set to false,
you would be triggering the backup through the controller.

___

###  store

• **store**: *StoreInit*

*Defined in [core/src/types.ts:66](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L66)*

___

###  type

• **type**: *string*

*Inherited from [BaseOptions](baseoptions.md).[type](baseoptions.md#type)*

*Defined in [core/src/types.ts:55](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L55)*

The type is primarily used as a target for the controller, in order
to centrally control a group of cachemaps in an application with muliple
instances.

## Methods

### `Optional` sortComparator

▸ **sortComparator**(`a`: any, `b`: any): *number*

*Inherited from [BaseOptions](baseoptions.md).[sortComparator](baseoptions.md#optional-sortcomparator)*

*Defined in [core/src/types.ts:60](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L60)*

The sort comparator is used to order cachemap entries by importance so the
reaper knows what entries to purge first.

**Parameters:**

Name | Type |
------ | ------ |
`a` | any |
`b` | any |

**Returns:** *number*
