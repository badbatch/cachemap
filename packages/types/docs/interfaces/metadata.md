[Documentation](../README.md) › [Metadata](metadata.md)

# Interface: Metadata

## Hierarchy

* [BaseMetadata](basemetadata.md)

  ↳ **Metadata**

## Index

### Properties

* [accessedCount](metadata.md#accessedcount)
* [added](metadata.md#added)
* [cacheability](metadata.md#cacheability)
* [key](metadata.md#key)
* [lastAccessed](metadata.md#lastaccessed)
* [lastUpdated](metadata.md#lastupdated)
* [size](metadata.md#size)
* [tags](metadata.md#tags)
* [updatedCount](metadata.md#updatedcount)

## Properties

###  accessedCount

• **accessedCount**: *number*

*Inherited from [BaseMetadata](basemetadata.md).[accessedCount](basemetadata.md#accessedcount)*

*Defined in [index.ts:8](https://github.com/badbatch/cachemap/blob/ca43a4d/packages/types/src/index.ts#L8)*

The number of times the corresponding data
entry has been accessed.

___

###  added

• **added**: *number*

*Inherited from [BaseMetadata](basemetadata.md).[added](basemetadata.md#added)*

*Defined in [index.ts:14](https://github.com/badbatch/cachemap/blob/ca43a4d/packages/types/src/index.ts#L14)*

The timestamp of when the corresponding data
entry was added to the Cachemap instance.

___

###  cacheability

• **cacheability**: *Cacheability*

*Defined in [index.ts:60](https://github.com/badbatch/cachemap/blob/ca43a4d/packages/types/src/index.ts#L60)*

The cache information of the corresponding
data entry, which uses the [Cacheability
module](https://github.com/dylanaubrey/cacheability).

___

###  key

• **key**: *string*

*Inherited from [BaseMetadata](basemetadata.md).[key](basemetadata.md#key)*

*Defined in [index.ts:20](https://github.com/badbatch/cachemap/blob/ca43a4d/packages/types/src/index.ts#L20)*

The key the corresponding data entry was stored
against.

___

###  lastAccessed

• **lastAccessed**: *number*

*Inherited from [BaseMetadata](basemetadata.md).[lastAccessed](basemetadata.md#lastaccessed)*

*Defined in [index.ts:26](https://github.com/badbatch/cachemap/blob/ca43a4d/packages/types/src/index.ts#L26)*

The timestamp of when the corresponding data
entry was last accessed.

___

###  lastUpdated

• **lastUpdated**: *number*

*Inherited from [BaseMetadata](basemetadata.md).[lastUpdated](basemetadata.md#lastupdated)*

*Defined in [index.ts:32](https://github.com/badbatch/cachemap/blob/ca43a4d/packages/types/src/index.ts#L32)*

The timestamp of when the corresponding data
entry was last updated.

___

###  size

• **size**: *number*

*Inherited from [BaseMetadata](basemetadata.md).[size](basemetadata.md#size)*

*Defined in [index.ts:38](https://github.com/badbatch/cachemap/blob/ca43a4d/packages/types/src/index.ts#L38)*

The approximate amount of memory the corresponding
data entry takes up.

___

###  tags

• **tags**: *any[]*

*Inherited from [BaseMetadata](basemetadata.md).[tags](basemetadata.md#tags)*

*Defined in [index.ts:45](https://github.com/badbatch/cachemap/blob/ca43a4d/packages/types/src/index.ts#L45)*

A list of tags that can be optionally set along with
the cachemap entry and used when trying to retrieve
a subset of data.

___

###  updatedCount

• **updatedCount**: *number*

*Inherited from [BaseMetadata](basemetadata.md).[updatedCount](basemetadata.md#updatedcount)*

*Defined in [index.ts:51](https://github.com/badbatch/cachemap/blob/ca43a4d/packages/types/src/index.ts#L51)*

The number of times the corresponding data
entry has been updated.
