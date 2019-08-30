**[Documentation](../README.md)**

[Globals](../README.md) › [ReaperCallbacks](reapercallbacks.md)

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

*Defined in [defs/index.ts:111](https://github.com/badbatch/cachemap/blob/4fa6105/packages/core/src/defs/index.ts#L111)*

#### Type declaration:

▸ (`key`: string, `options?`: undefined | object): *Promise‹boolean›*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`options?` | undefined \| object |

___

###  metadataCallback

• **metadataCallback**: *function*

*Defined in [defs/index.ts:112](https://github.com/badbatch/cachemap/blob/4fa6105/packages/core/src/defs/index.ts#L112)*

#### Type declaration:

▸ (): *[Metadata](metadata.md)[]*