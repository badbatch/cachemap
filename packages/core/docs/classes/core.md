> **[Documentation](../README.md)**

[Core](core.md) /

# Class: Core

## Hierarchy

* **Core**

### Index

#### Constructors

* [constructor](core.md#constructor)

#### Accessors

* [metadata](core.md#metadata)
* [name](core.md#name)
* [storeType](core.md#storetype)
* [usedHeapSize](core.md#usedheapsize)

#### Methods

* [clear](core.md#clear)
* [delete](core.md#delete)
* [entries](core.md#entries)
* [export](core.md#export)
* [get](core.md#get)
* [has](core.md#has)
* [import](core.md#import)
* [set](core.md#set)
* [size](core.md#size)
* [init](core.md#static-init)

## Constructors

###  constructor

\+ **new Core**(`options`: *[ConstructorOptions](../interfaces/constructoroptions.md)*): *[Core](core.md)*

*Defined in [main/index.ts:92](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConstructorOptions](../interfaces/constructoroptions.md) |

**Returns:** *[Core](core.md)*

## Accessors

###  metadata

• **get metadata**(): *[Metadata](../interfaces/metadata.md)[]*

*Defined in [main/index.ts:117](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L117)*

**Returns:** *[Metadata](../interfaces/metadata.md)[]*

___

###  name

• **get name**(): *string*

*Defined in [main/index.ts:121](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L121)*

**Returns:** *string*

___

###  storeType

• **get storeType**(): *string*

*Defined in [main/index.ts:125](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L125)*

**Returns:** *string*

___

###  usedHeapSize

• **get usedHeapSize**(): *number*

*Defined in [main/index.ts:129](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L129)*

**Returns:** *number*

## Methods

###  clear

▸ **clear**(): *`Promise<void>`*

*Defined in [main/index.ts:133](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L133)*

**Returns:** *`Promise<void>`*

___

###  delete

▸ **delete**(`key`: *string*, `options`: *object*): *`Promise<boolean>`*

*Defined in [main/index.ts:144](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L144)*

**Parameters:**

▪ **key**: *string*

▪`Default value`  **options**: *object*=  {}

Name | Type |
------ | ------ |
`hash?` | undefined \| false \| true |

**Returns:** *`Promise<boolean>`*

___

###  entries

▸ **entries**(`keys?`: *string[]*): *`Promise<Array<[string, any]>>`*

*Defined in [main/index.ts:164](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L164)*

**Parameters:**

Name | Type |
------ | ------ |
`keys?` | string[] |

**Returns:** *`Promise<Array<[string, any]>>`*

___

###  export

▸ **export**(`options`: *[ExportOptions](../interfaces/exportoptions.md)*): *`Promise<ExportResult>`*

*Defined in [main/index.ts:176](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L176)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ExportOptions](../interfaces/exportoptions.md) |  {} |

**Returns:** *`Promise<ExportResult>`*

___

###  get

▸ **get**(`key`: *string*, `options`: *object*): *`Promise<any>`*

*Defined in [main/index.ts:196](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L196)*

**Parameters:**

▪ **key**: *string*

▪`Default value`  **options**: *object*=  {}

Name | Type |
------ | ------ |
`hash?` | undefined \| false \| true |

**Returns:** *`Promise<any>`*

___

###  has

▸ **has**(`key`: *string*, `options`: *object*): *`Promise<false | Cacheability>`*

*Defined in [main/index.ts:216](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L216)*

**Parameters:**

▪ **key**: *string*

▪`Default value`  **options**: *object*=  {}

Name | Type |
------ | ------ |
`deleteExpired?` | undefined \| false \| true |
`hash?` | undefined \| false \| true |

**Returns:** *`Promise<false | Cacheability>`*

___

###  import

▸ **import**(`options`: *[ImportOptions](../interfaces/importoptions.md)*): *`Promise<void>`*

*Defined in [main/index.ts:239](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L239)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ImportOptions](../interfaces/importoptions.md) |

**Returns:** *`Promise<void>`*

___

###  set

▸ **set**(`key`: *string*, `value`: *any*, `options`: *object*): *`Promise<void>`*

*Defined in [main/index.ts:264](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L264)*

**Parameters:**

▪ **key**: *string*

▪ **value**: *any*

▪`Default value`  **options**: *object*=  {}

Name | Type |
------ | ------ |
`cacheHeaders?` | [CacheHeaders](../README.md#cacheheaders) |
`hash?` | undefined \| false \| true |
`tag?` | any |

**Returns:** *`Promise<void>`*

___

###  size

▸ **size**(): *`Promise<number>`*

*Defined in [main/index.ts:288](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L288)*

**Returns:** *`Promise<number>`*

___

### `Static` init

▸ **init**(`options`: *[InitOptions](../interfaces/initoptions.md)*): *`Promise<Core>`*

*Defined in [main/index.ts:27](https://github.com/badbatch/cachemap/blob/f0089aa/packages/core/src/main/index.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [InitOptions](../interfaces/initoptions.md) |

**Returns:** *`Promise<Core>`*