[Documentation](../README.md) › [BaseMetadata](basemetadata.md)

# Interface: BaseMetadata

## Hierarchy

* **BaseMetadata**

  ↳ [DehydratedMetadata](dehydratedmetadata.md)

  ↳ [Metadata](metadata.md)

## Index

### Properties

* [accessedCount](basemetadata.md#accessedcount)
* [added](basemetadata.md#added)
* [key](basemetadata.md#key)
* [lastAccessed](basemetadata.md#lastaccessed)
* [lastUpdated](basemetadata.md#lastupdated)
* [size](basemetadata.md#size)
* [tags](basemetadata.md#tags)
* [updatedCount](basemetadata.md#updatedcount)

## Properties

###  accessedCount

• **accessedCount**: *number*

*Defined in [types.ts:8](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/types.ts#L8)*

The number of times the corresponding data
entry has been accessed.

___

###  added

• **added**: *number*

*Defined in [types.ts:14](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/types.ts#L14)*

The timestamp of when the corresponding data
entry was added to the Cachemap instance.

___

###  key

• **key**: *string*

*Defined in [types.ts:20](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/types.ts#L20)*

The key the corresponding data entry was stored
against.

___

###  lastAccessed

• **lastAccessed**: *number*

*Defined in [types.ts:26](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/types.ts#L26)*

The timestamp of when the corresponding data
entry was last accessed.

___

###  lastUpdated

• **lastUpdated**: *number*

*Defined in [types.ts:32](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/types.ts#L32)*

The timestamp of when the corresponding data
entry was last updated.

___

###  size

• **size**: *number*

*Defined in [types.ts:38](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/types.ts#L38)*

The approximate amount of memory the corresponding
data entry takes up.

___

###  tags

• **tags**: *any[]*

*Defined in [types.ts:45](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/types.ts#L45)*

A list of tags that can be optionally set along with
the cachemap entry and used when trying to retrieve
a subset of data.

___

###  updatedCount

• **updatedCount**: *number*

*Defined in [types.ts:51](https://github.com/badbatch/cachemap/blob/6239088/packages/core/src/types.ts#L51)*

The number of times the corresponding data
entry has been updated.
