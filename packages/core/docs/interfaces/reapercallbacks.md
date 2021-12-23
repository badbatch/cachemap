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

*Defined in [types.ts:117](https://github.com/badbatch/cachemap/blob/b180798/packages/core/src/types.ts#L117)*

#### Type declaration:

▸ (`key`: string, `options?`: undefined | object): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`options?` | undefined &#124; object |

___

###  metadataCallback

• **metadataCallback**: *function*

*Defined in [types.ts:118](https://github.com/badbatch/cachemap/blob/b180798/packages/core/src/types.ts#L118)*

#### Type declaration:

▸ (): *[Metadata](metadata.md)[]*
