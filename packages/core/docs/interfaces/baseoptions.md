[Documentation](../README.md) › [BaseOptions](baseoptions.md)

# Interface: BaseOptions

## Hierarchy

* **BaseOptions**

  ↳ [ConstructorOptions](constructoroptions.md)

## Index

### Properties

* [backupInterval](baseoptions.md#optional-backupinterval)
* [backupStore](baseoptions.md#optional-backupstore)
* [disableCacheInvalidation](baseoptions.md#optional-disablecacheinvalidation)
* [encryptionSecret](baseoptions.md#optional-encryptionsecret)
* [name](baseoptions.md#name)
* [reaper](baseoptions.md#optional-reaper)
* [sharedCache](baseoptions.md#optional-sharedcache)
* [startBackup](baseoptions.md#optional-startbackup)
* [type](baseoptions.md#type)

### Methods

* [sortComparator](baseoptions.md#optional-sortcomparator)

## Properties

### `Optional` backupInterval

• **backupInterval**? : *undefined | number*

*Defined in [core/src/types.ts:9](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L9)*

The time in milliseconds between back ups from a map store
to the provided persisted store.

___

### `Optional` backupStore

• **backupStore**? : *undefined | false | true*

*Defined in [core/src/types.ts:17](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L17)*

Whether to use store to back up to from a map store. If true,
the provided store is used to periodically back up to rather than
directly write to. This makes reading/writing much quicker, but
still gives you persistence across browser reloads or server
restarts. If true, the store should be a peristed store.

___

### `Optional` disableCacheInvalidation

• **disableCacheInvalidation**? : *undefined | false | true*

*Defined in [core/src/types.ts:23](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L23)*

Whether to disable the checking of a cache entry's TTL before
returning the entry. This also disabling the purging of stale
cache entries by the reaper, if one is configured.

___

### `Optional` encryptionSecret

• **encryptionSecret**? : *undefined | string*

*Defined in [core/src/types.ts:28](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L28)*

This is used to encrypt all entries. If a secret is provided,
all entries are encrypted.

___

###  name

• **name**: *string*

*Defined in [core/src/types.ts:34](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L34)*

The name is primarily used as a target for the controller, in order
to centrally control the cachemap in an application with muliple
instances.

___

### `Optional` reaper

• **reaper**? : *[ReaperInit](../README.md#reaperinit)*

*Defined in [core/src/types.ts:39](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L39)*

The reaper is used to keep the cachemap size below user specified limits
by purging the least imporant entries in the cachemap.

___

### `Optional` sharedCache

• **sharedCache**? : *undefined | false | true*

*Defined in [core/src/types.ts:44](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L44)*

Whether the cache is shared. If true, entries with a cache control
header of "private" are not stored in the cachemap.

___

### `Optional` startBackup

• **startBackup**? : *undefined | false | true*

*Defined in [core/src/types.ts:49](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L49)*

Whether to start backing up store on initialisation. If set to false,
you would be triggering the backup through the controller.

___

###  type

• **type**: *string*

*Defined in [core/src/types.ts:55](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L55)*

The type is primarily used as a target for the controller, in order
to centrally control a group of cachemaps in an application with muliple
instances.

## Methods

### `Optional` sortComparator

▸ **sortComparator**(`a`: any, `b`: any): *number*

*Defined in [core/src/types.ts:60](https://github.com/badbatch/cachemap/blob/27e229b/packages/core/src/types.ts#L60)*

The sort comparator is used to order cachemap entries by importance so the
reaper knows what entries to purge first.

**Parameters:**

Name | Type |
------ | ------ |
`a` | any |
`b` | any |

**Returns:** *number*
