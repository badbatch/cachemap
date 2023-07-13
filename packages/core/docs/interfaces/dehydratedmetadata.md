[Documentation](../README.md) › [DehydratedMetadata](dehydratedmetadata.md)

# Interface: DehydratedMetadata

## Hierarchy

* BaseMetadata

  ↳ **DehydratedMetadata**

## Index

### Properties

* [accessedCount](dehydratedmetadata.md#accessedcount)
* [added](dehydratedmetadata.md#added)
* [cacheability](dehydratedmetadata.md#cacheability)
* [key](dehydratedmetadata.md#key)
* [lastAccessed](dehydratedmetadata.md#lastaccessed)
* [lastUpdated](dehydratedmetadata.md#lastupdated)
* [size](dehydratedmetadata.md#size)
* [tags](dehydratedmetadata.md#tags)
* [updatedCount](dehydratedmetadata.md#updatedcount)

## Properties

###  accessedCount

• **accessedCount**: *number*

*Inherited from [DehydratedMetadata](dehydratedmetadata.md).[accessedCount](dehydratedmetadata.md#accessedcount)*

Defined in types/lib/types/index.d.ts:7

The number of times the corresponding data
entry has been accessed.

___

###  added

• **added**: *number*

*Inherited from [DehydratedMetadata](dehydratedmetadata.md).[added](dehydratedmetadata.md#added)*

Defined in types/lib/types/index.d.ts:12

The timestamp of when the corresponding data
entry was added to the Cachemap instance.

___

###  cacheability

• **cacheability**: *object*

*Defined in [core/src/types.ts:70](https://github.com/badbatch/cachemap/blob/f503e0e/packages/core/src/types.ts#L70)*

#### Type declaration:

* **metadata**: *CacheabilityMetadata*

___

###  key

• **key**: *string*

*Inherited from [DehydratedMetadata](dehydratedmetadata.md).[key](dehydratedmetadata.md#key)*

Defined in types/lib/types/index.d.ts:17

The key the corresponding data entry was stored
against.

___

###  lastAccessed

• **lastAccessed**: *number*

*Inherited from [DehydratedMetadata](dehydratedmetadata.md).[lastAccessed](dehydratedmetadata.md#lastaccessed)*

Defined in types/lib/types/index.d.ts:22

The timestamp of when the corresponding data
entry was last accessed.

___

###  lastUpdated

• **lastUpdated**: *number*

*Inherited from [DehydratedMetadata](dehydratedmetadata.md).[lastUpdated](dehydratedmetadata.md#lastupdated)*

Defined in types/lib/types/index.d.ts:27

The timestamp of when the corresponding data
entry was last updated.

___

###  size

• **size**: *number*

*Inherited from [DehydratedMetadata](dehydratedmetadata.md).[size](dehydratedmetadata.md#size)*

Defined in types/lib/types/index.d.ts:32

The approximate amount of memory the corresponding
data entry takes up.

___

###  tags

• **tags**: *any[]*

*Inherited from [DehydratedMetadata](dehydratedmetadata.md).[tags](dehydratedmetadata.md#tags)*

Defined in types/lib/types/index.d.ts:38

A list of tags that can be optionally set along with
the cachemap entry and used when trying to retrieve
a subset of data.

___

###  updatedCount

• **updatedCount**: *number*

*Inherited from [DehydratedMetadata](dehydratedmetadata.md).[updatedCount](dehydratedmetadata.md#updatedcount)*

Defined in types/lib/types/index.d.ts:43

The number of times the corresponding data
entry has been updated.
