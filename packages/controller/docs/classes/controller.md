[Documentation](../README.md) › [Controller](controller.md)

# Class: Controller ‹**EventTypes, Context**›

## Type parameters

▪ **EventTypes**: *EventEmitter.ValidEventTypes*

▪ **Context**: *any*

## Hierarchy

* EventEmitter

  ↳ **Controller**

## Index

### Interfaces

* [EventEmitterStatic](../interfaces/controller.eventemitterstatic.md)
* [ListenerFn](../interfaces/controller.listenerfn.md)

### Type aliases

* [ArgumentMap](controller.md#static-argumentmap)
* [EventArgs](controller.md#static-eventargs)
* [EventListener](controller.md#static-eventlistener)
* [EventNames](controller.md#static-eventnames)
* [ValidEventTypes](controller.md#static-valideventtypes)

### Properties

* [EventEmitter](controller.md#static-eventemitter)
* [prefixed](controller.md#static-prefixed)

### Methods

* [addListener](controller.md#addlistener)
* [clearCaches](controller.md#clearcaches)
* [emit](controller.md#emit)
* [eventNames](controller.md#eventnames)
* [listenerCount](controller.md#listenercount)
* [listeners](controller.md#listeners)
* [off](controller.md#off)
* [on](controller.md#on)
* [once](controller.md#once)
* [removeAllListeners](controller.md#removealllisteners)
* [removeListener](controller.md#removelistener)
* [startReapers](controller.md#startreapers)
* [stopReapers](controller.md#stopreapers)

## Type aliases

### `Static` ArgumentMap

Ƭ **ArgumentMap**: *object*

Defined in node_modules/eventemitter3/index.d.ts:109

#### Type declaration:

___

### `Static` EventArgs

Ƭ **EventArgs**: *Parameters‹[EventListener](controller.md#static-eventlistener)‹T, K››*

Defined in node_modules/eventemitter3/index.d.ts:126

___

### `Static` EventListener

Ƭ **EventListener**: *T extends string | symbol ? function : function*

Defined in node_modules/eventemitter3/index.d.ts:117

___

### `Static` EventNames

Ƭ **EventNames**: *T extends string | symbol ? T : keyof T*

Defined in node_modules/eventemitter3/index.d.ts:105

___

### `Static` ValidEventTypes

Ƭ **ValidEventTypes**: *string | symbol | object*

Defined in node_modules/eventemitter3/index.d.ts:103

`object` should be in either of the following forms:
```
interface EventTypes {
  'event-with-parameters': any[]
  'event-with-example-handler': (...args: any[]) => void
}
```

## Properties

### `Static` EventEmitter

▪ **EventEmitter**: *[EventEmitterStatic](../interfaces/controller.eventemitterstatic.md)*

Defined in node_modules/eventemitter3/index.d.ts:131

___

### `Static` prefixed

▪ **prefixed**: *string | boolean*

*Inherited from [Controller](controller.md).[prefixed](controller.md#static-prefixed)*

Defined in node_modules/eventemitter3/index.d.ts:9

## Methods

###  addListener

▸ **addListener**‹**T**›(`event`: T, `fn`: EventEmitter.EventListener‹EventTypes, T›, `context?`: Context): *this*

*Inherited from [Controller](controller.md).[addListener](controller.md#addlistener)*

Defined in node_modules/eventemitter3/index.d.ts:45

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn` | EventEmitter.EventListener‹EventTypes, T› |
`context?` | Context |

**Returns:** *this*

___

###  clearCaches

▸ **clearCaches**(`__namedParameters`: object): *void*

*Defined in [packages/controller/src/main/index.ts:7](https://github.com/badbatch/cachemap/blob/6239088/packages/controller/src/main/index.ts#L7)*

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type |
------ | ------ |
`name` | undefined &#124; string |
`type` | undefined &#124; string |

**Returns:** *void*

___

###  emit

▸ **emit**‹**T**›(`event`: T, ...`args`: EventEmitter.EventArgs‹EventTypes, T›): *boolean*

*Inherited from [Controller](controller.md).[emit](controller.md#emit)*

Defined in node_modules/eventemitter3/index.d.ts:32

Calls each of the listeners registered for a given event.

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`...args` | EventEmitter.EventArgs‹EventTypes, T› |

**Returns:** *boolean*

___

###  eventNames

▸ **eventNames**(): *Array‹EventEmitter.EventNames‹EventTypes››*

*Inherited from [Controller](controller.md).[eventNames](controller.md#eventnames)*

Defined in node_modules/eventemitter3/index.d.ts:15

Return an array listing the events for which the emitter has registered
listeners.

**Returns:** *Array‹EventEmitter.EventNames‹EventTypes››*

___

###  listenerCount

▸ **listenerCount**(`event`: EventEmitter.EventNames‹EventTypes›): *number*

*Inherited from [Controller](controller.md).[listenerCount](controller.md#listenercount)*

Defined in node_modules/eventemitter3/index.d.ts:27

Return the number of listeners listening to a given event.

**Parameters:**

Name | Type |
------ | ------ |
`event` | EventEmitter.EventNames‹EventTypes› |

**Returns:** *number*

___

###  listeners

▸ **listeners**‹**T**›(`event`: T): *Array‹EventEmitter.EventListener‹EventTypes, T››*

*Inherited from [Controller](controller.md).[listeners](controller.md#listeners)*

Defined in node_modules/eventemitter3/index.d.ts:20

Return the listeners registered for a given event.

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |

**Returns:** *Array‹EventEmitter.EventListener‹EventTypes, T››*

___

###  off

▸ **off**‹**T**›(`event`: T, `fn?`: EventEmitter.EventListener‹EventTypes, T›, `context?`: Context, `once?`: undefined | false | true): *this*

*Inherited from [Controller](controller.md).[off](controller.md#off)*

Defined in node_modules/eventemitter3/index.d.ts:69

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn?` | EventEmitter.EventListener‹EventTypes, T› |
`context?` | Context |
`once?` | undefined &#124; false &#124; true |

**Returns:** *this*

___

###  on

▸ **on**‹**T**›(`event`: T, `fn`: EventEmitter.EventListener‹EventTypes, T›, `context?`: Context): *this*

*Inherited from [Controller](controller.md).[on](controller.md#on)*

Defined in node_modules/eventemitter3/index.d.ts:40

Add a listener for a given event.

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn` | EventEmitter.EventListener‹EventTypes, T› |
`context?` | Context |

**Returns:** *this*

___

###  once

▸ **once**‹**T**›(`event`: T, `fn`: EventEmitter.EventListener‹EventTypes, T›, `context?`: Context): *this*

*Inherited from [Controller](controller.md).[once](controller.md#once)*

Defined in node_modules/eventemitter3/index.d.ts:54

Add a one-time listener for a given event.

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn` | EventEmitter.EventListener‹EventTypes, T› |
`context?` | Context |

**Returns:** *this*

___

###  removeAllListeners

▸ **removeAllListeners**(`event?`: EventEmitter.EventNames‹EventTypes›): *this*

*Inherited from [Controller](controller.md).[removeAllListeners](controller.md#removealllisteners)*

Defined in node_modules/eventemitter3/index.d.ts:79

Remove all listeners, or those of the specified event.

**Parameters:**

Name | Type |
------ | ------ |
`event?` | EventEmitter.EventNames‹EventTypes› |

**Returns:** *this*

___

###  removeListener

▸ **removeListener**‹**T**›(`event`: T, `fn?`: EventEmitter.EventListener‹EventTypes, T›, `context?`: Context, `once?`: undefined | false | true): *this*

*Inherited from [Controller](controller.md).[removeListener](controller.md#removelistener)*

Defined in node_modules/eventemitter3/index.d.ts:63

Remove the listeners of a given event.

**Type parameters:**

▪ **T**: *EventEmitter.EventNames‹EventTypes›*

**Parameters:**

Name | Type |
------ | ------ |
`event` | T |
`fn?` | EventEmitter.EventListener‹EventTypes, T› |
`context?` | Context |
`once?` | undefined &#124; false &#124; true |

**Returns:** *this*

___

###  startReapers

▸ **startReapers**(`__namedParameters`: object): *void*

*Defined in [packages/controller/src/main/index.ts:15](https://github.com/badbatch/cachemap/blob/6239088/packages/controller/src/main/index.ts#L15)*

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type |
------ | ------ |
`name` | undefined &#124; string |
`type` | undefined &#124; string |

**Returns:** *void*

___

###  stopReapers

▸ **stopReapers**(`__namedParameters`: object): *void*

*Defined in [packages/controller/src/main/index.ts:23](https://github.com/badbatch/cachemap/blob/6239088/packages/controller/src/main/index.ts#L23)*

**Parameters:**

▪`Default value`  **__namedParameters**: *object*= {}

Name | Type |
------ | ------ |
`name` | undefined &#124; string |
`type` | undefined &#124; string |

**Returns:** *void*
