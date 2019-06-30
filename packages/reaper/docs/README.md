> **[Documentation](README.md)**

### Index

#### Classes

* [Reaper](classes/reaper.md)

#### Interfaces

* [Callbacks](interfaces/callbacks.md)
* [ConstructorOptions](interfaces/constructoroptions.md)
* [Options](interfaces/options.md)

#### Type aliases

* [DeleteCallback](README.md#deletecallback)
* [Init](README.md#init)
* [MetadataCallback](README.md#metadatacallback)

#### Functions

* [init](README.md#init)

## Type aliases

###  DeleteCallback

Ƭ **DeleteCallback**: *function*

*Defined in [defs/index.ts:15](https://github.com/badbatch/cachemap/blob/f0089aa/packages/reaper/src/defs/index.ts#L15)*

#### Type declaration:

▸ (`key`: *string*, `options?`: *undefined | object*): *`Promise<boolean>`*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`options?` | undefined \| object |

___

###  Init

Ƭ **Init**: *function*

*Defined in [defs/index.ts:17](https://github.com/badbatch/cachemap/blob/f0089aa/packages/reaper/src/defs/index.ts#L17)*

#### Type declaration:

▸ (`callbacks`: *[Callbacks](interfaces/callbacks.md)*): *[Reaper](classes/reaper.md)*

**Parameters:**

Name | Type |
------ | ------ |
`callbacks` | [Callbacks](interfaces/callbacks.md) |

___

###  MetadataCallback

Ƭ **MetadataCallback**: *function*

*Defined in [defs/index.ts:19](https://github.com/badbatch/cachemap/blob/f0089aa/packages/reaper/src/defs/index.ts#L19)*

#### Type declaration:

▸ (): *`Metadata`[]*

## Functions

###  init

▸ **init**(`options`: *[Options](interfaces/options.md)*): *[Init](README.md#init)*

*Defined in [main/index.ts:70](https://github.com/badbatch/cachemap/blob/f0089aa/packages/reaper/src/main/index.ts#L70)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [Options](interfaces/options.md) |  {} |

**Returns:** *[Init](README.md#init)*