[Documentation](../README.md) › [ReaperCallbacks](reapercallbacks.md)

# Interface: ReaperCallbacks

## Hierarchy

* **ReaperCallbacks**

## Index

### Properties

* [deleteCallback](reapercallbacks.md#deletecallback)
* [metadataCallback](reapercallbacks.md#metadatacallback)

## Properties

###  deleteCallback

• **deleteCallback**: *function*

*Defined in [core/src/types.ts:107](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L107)*

#### Type declaration:

▸ (`key`: string, `tags?`: any[]): *Promise‹void›*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`tags?` | any[] |

___

###  metadataCallback

• **metadataCallback**: *function*

*Defined in [core/src/types.ts:108](https://github.com/badbatch/cachemap/blob/141407d/packages/core/src/types.ts#L108)*

#### Type declaration:

▸ (): *Metadata[]*
