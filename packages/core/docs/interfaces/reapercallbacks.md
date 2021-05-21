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

*Defined in [types.ts:111](https://github.com/badbatch/cachemap/blob/ba019ba/packages/core/src/types.ts#L111)*

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

*Defined in [types.ts:112](https://github.com/badbatch/cachemap/blob/ba019ba/packages/core/src/types.ts#L112)*

#### Type declaration:

▸ (): *[Metadata](metadata.md)[]*
