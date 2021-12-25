[Documentation](../README.md) › [InitOptions](initoptions.md)

# Interface: InitOptions

## Hierarchy

  ↳ [Options](options.md)

  ↳ **InitOptions**

## Index

### Properties

* [auth_pass](initoptions.md#optional-auth_pass)
* [connect_timeout](initoptions.md#optional-connect_timeout)
* [db](initoptions.md#optional-db)
* [detect_buffers](initoptions.md#optional-detect_buffers)
* [disable_resubscribing](initoptions.md#optional-disable_resubscribing)
* [enable_offline_queue](initoptions.md#optional-enable_offline_queue)
* [family](initoptions.md#optional-family)
* [fast](initoptions.md#optional-fast)
* [host](initoptions.md#optional-host)
* [maxHeapSize](initoptions.md#optional-maxheapsize)
* [max_attempts](initoptions.md#optional-max_attempts)
* [mock](initoptions.md#optional-mock)
* [name](initoptions.md#name)
* [no_ready_check](initoptions.md#optional-no_ready_check)
* [parser](initoptions.md#optional-parser)
* [password](initoptions.md#optional-password)
* [path](initoptions.md#optional-path)
* [port](initoptions.md#optional-port)
* [prefix](initoptions.md#optional-prefix)
* [rename_commands](initoptions.md#optional-rename_commands)
* [retry_max_delay](initoptions.md#optional-retry_max_delay)
* [retry_strategy](initoptions.md#optional-retry_strategy)
* [retry_unfulfilled_commands](initoptions.md#optional-retry_unfulfilled_commands)
* [return_buffers](initoptions.md#optional-return_buffers)
* [socket_initial_delay](initoptions.md#optional-socket_initial_delay)
* [socket_keepalive](initoptions.md#optional-socket_keepalive)
* [string_numbers](initoptions.md#optional-string_numbers)
* [tls](initoptions.md#optional-tls)
* [url](initoptions.md#optional-url)

## Properties

### `Optional` auth_pass

• **auth_pass**? : *undefined | string*

*Inherited from [InitOptions](initoptions.md).[auth_pass](initoptions.md#optional-auth_pass)*

Defined in node_modules/@types/redis/index.d.ts:129

___

### `Optional` connect_timeout

• **connect_timeout**? : *undefined | number*

*Inherited from [InitOptions](initoptions.md).[connect_timeout](initoptions.md#optional-connect_timeout)*

Defined in node_modules/@types/redis/index.d.ts:119

___

### `Optional` db

• **db**? : *string | number*

*Inherited from [InitOptions](initoptions.md).[db](initoptions.md#optional-db)*

Defined in node_modules/@types/redis/index.d.ts:141

If set, client will run Redis **select** command on connect.

**`default`** null

___

### `Optional` detect_buffers

• **detect_buffers**? : *undefined | false | true*

*Inherited from [InitOptions](initoptions.md).[detect_buffers](initoptions.md#optional-detect_buffers)*

Defined in node_modules/@types/redis/index.d.ts:86

If set to `true`, then replies will be sent to callbacks as Buffers.
This option lets you switch between Buffers and Strings on a per-command basis,
whereas `return_buffers` applies to every command on a client.\
**Note**: This doesn't work properly with the pubsub mode.
A subscriber has to either always return Strings or Buffers.

**`default`** false

___

### `Optional` disable_resubscribing

• **disable_resubscribing**? : *undefined | false | true*

*Inherited from [InitOptions](initoptions.md).[disable_resubscribing](initoptions.md#optional-disable_resubscribing)*

Defined in node_modules/@types/redis/index.d.ts:154

If set to `true`, a client won't resubscribe after disconnecting.

**`default`** false

___

### `Optional` enable_offline_queue

• **enable_offline_queue**? : *undefined | false | true*

*Inherited from [InitOptions](initoptions.md).[enable_offline_queue](initoptions.md#optional-enable_offline_queue)*

Defined in node_modules/@types/redis/index.d.ts:117

By default, if there is no active connection to the Redis server,
commands are added to a queue and are executed once the connection has been established.
Setting `enable_offline_queue` to `false` will disable this feature
and the callback will be executed immediately with an error,
or an error will be emitted if no callback is specified.

**`default`** true

___

### `Optional` family

• **family**? : *undefined | string*

*Inherited from [InitOptions](initoptions.md).[family](initoptions.md#optional-family)*

Defined in node_modules/@types/redis/index.d.ts:149

You can force using IPv6 if you set the family to **IPv6**.

**`see`** Node.js [net](https://nodejs.org/api/net.html)
or [dns](https://nodejs.org/api/dns.html)
modules on how to use the family type.

**`default`** IPv4

___

### `Optional` fast

• **fast**? : *undefined | false | true*

*Inherited from [InitOptions](initoptions.md).[fast](initoptions.md#optional-fast)*

*Defined in [packages/redis/src/types.ts:14](https://github.com/badbatch/cachemap/blob/631c61b/packages/redis/src/types.ts#L14)*

___

### `Optional` host

• **host**? : *undefined | string*

*Inherited from [InitOptions](initoptions.md).[host](initoptions.md#optional-host)*

Defined in node_modules/@types/redis/index.d.ts:44

IP address of the Redis server.

**`default`** 127.0.0.1

___

### `Optional` maxHeapSize

• **maxHeapSize**? : *undefined | number*

*Inherited from [InitOptions](initoptions.md).[maxHeapSize](initoptions.md#optional-maxheapsize)*

*Defined in [packages/redis/src/types.ts:15](https://github.com/badbatch/cachemap/blob/631c61b/packages/redis/src/types.ts#L15)*

___

### `Optional` max_attempts

• **max_attempts**? : *undefined | number*

*Inherited from [InitOptions](initoptions.md).[max_attempts](initoptions.md#optional-max_attempts)*

Defined in node_modules/@types/redis/index.d.ts:120

___

### `Optional` mock

• **mock**? : *undefined | false | true*

*Inherited from [InitOptions](initoptions.md).[mock](initoptions.md#optional-mock)*

*Defined in [packages/redis/src/types.ts:16](https://github.com/badbatch/cachemap/blob/631c61b/packages/redis/src/types.ts#L16)*

___

###  name

• **name**: *string*

*Defined in [packages/redis/src/types.ts:10](https://github.com/badbatch/cachemap/blob/631c61b/packages/redis/src/types.ts#L10)*

___

### `Optional` no_ready_check

• **no_ready_check**? : *undefined | false | true*

*Inherited from [InitOptions](initoptions.md).[no_ready_check](initoptions.md#optional-no_ready_check)*

Defined in node_modules/@types/redis/index.d.ts:108

When a connection is established to the Redis server,
the server might still be loading the database from disk.
While loading, the server will not respond to any commands.
To work around this, Node Redis has a "ready check" which sends the **INFO** command to the server.
The response from the **INFO** command indicates whether the server is ready for more commands.
When ready, **node_redis** emits a **ready** event.
Setting `no_ready_check` to `true` will inhibit this check.

**`default`** false

___

### `Optional` parser

• **parser**? : *undefined | string*

*Inherited from [InitOptions](initoptions.md).[parser](initoptions.md#optional-parser)*

Defined in node_modules/@types/redis/index.d.ts:63

___

### `Optional` password

• **password**? : *undefined | string*

*Inherited from [InitOptions](initoptions.md).[password](initoptions.md#optional-password)*

Defined in node_modules/@types/redis/index.d.ts:136

If set, client will run Redis auth command on connect.
Alias `auth_pass`.\
**Note**: Node Redis < 2.5 must use `auth_pass`.

**`default`** null

___

### `Optional` path

• **path**? : *undefined | string*

*Inherited from [InitOptions](initoptions.md).[path](initoptions.md#optional-path)*

Defined in node_modules/@types/redis/index.d.ts:54

The UNIX socket string of the Redis server.

**`default`** null

___

### `Optional` port

• **port**? : *undefined | number*

*Inherited from [InitOptions](initoptions.md).[port](initoptions.md#optional-port)*

Defined in node_modules/@types/redis/index.d.ts:49

Port of the Redis server.

**`default`** 6379

___

### `Optional` prefix

• **prefix**? : *undefined | string*

*Inherited from [InitOptions](initoptions.md).[prefix](initoptions.md#optional-prefix)*

Defined in node_modules/@types/redis/index.d.ts:178

A string used to prefix all used keys (e.g. namespace:test).
Please be aware that the **keys** command will not be prefixed.
The **keys** command has a "pattern" as argument and no key
and it would be impossible to determine the existing keys in Redis if this would be prefixed.

**`default`** null

___

### `Optional` rename_commands

• **rename_commands**? : *object | null*

*Inherited from [InitOptions](initoptions.md).[rename_commands](initoptions.md#optional-rename_commands)*

Defined in node_modules/@types/redis/index.d.ts:162

Passing an object with renamed commands to use instead of the original functions.
For example, if you renamed the command **KEYS** to "DO-NOT-USE"
then the `rename_commands` object would be: { KEYS : "DO-NOT-USE" }.

**`see`** the [Redis security topics](http://redis.io/topics/security) for more info.

**`default`** null

___

### `Optional` retry_max_delay

• **retry_max_delay**? : *undefined | number*

*Inherited from [InitOptions](initoptions.md).[retry_max_delay](initoptions.md#optional-retry_max_delay)*

Defined in node_modules/@types/redis/index.d.ts:118

___

### `Optional` retry_strategy

• **retry_strategy**? : *RetryStrategy*

*Inherited from [InitOptions](initoptions.md).[retry_strategy](initoptions.md#optional-retry_strategy)*

Defined in node_modules/@types/redis/index.d.ts:211

A function that receives an options object as parameter including the retry `attempt`,
the `total_retry_time` indicating how much time passed since the last time connected,
the **error** why the connection was lost and the number of `times_connected` in total.
If you return a number from this function, the retry will happen after that time in milliseconds.
If you return a non-number, no further retry will happen
and all offline commands are flushed with errors.
Return an error to return that specific error to all offline commands.

**`default`** function

**`see`** interface `RetryStrategyOptions`

**`example`** 
const client = redis.createClient({
  retry_strategy: function(options) {
  if (options.error && options.error.code === "ECONNREFUSED") {
    // End reconnecting on a specific error and flush all commands with
    // a individual error
    return new Error("The server refused the connection");
  }
  if (options.total_retry_time > 1000 * 60 * 60) {
    // End reconnecting after a specific timeout and flush all commands
    // with a individual error
    return new Error("Retry time exhausted");
  }
  if (options.attempt > 10) {
    // End reconnecting with built in error
    return undefined;
  }
  // reconnect after
  return Math.min(options.attempt * 100, 3000);
  }
});

___

### `Optional` retry_unfulfilled_commands

• **retry_unfulfilled_commands**? : *undefined | false | true*

*Inherited from [InitOptions](initoptions.md).[retry_unfulfilled_commands](initoptions.md#optional-retry_unfulfilled_commands)*

Defined in node_modules/@types/redis/index.d.ts:128

If set to `true`, all commands that were unfulfilled while the connection is lost
will be retried after the connection has been reestablished.
Use this with caution if you use state altering commands (e.g. incr).
This is especially useful if you use blocking commands.

**`default`** false

___

### `Optional` return_buffers

• **return_buffers**? : *undefined | false | true*

*Inherited from [InitOptions](initoptions.md).[return_buffers](initoptions.md#optional-return_buffers)*

Defined in node_modules/@types/redis/index.d.ts:77

If set to `true`, then all replies will be sent to callbacks as Buffers instead of Strings.

**`default`** false

___

### `Optional` socket_initial_delay

• **socket_initial_delay**? : *undefined | number*

*Inherited from [InitOptions](initoptions.md).[socket_initial_delay](initoptions.md#optional-socket_initial_delay)*

Defined in node_modules/@types/redis/index.d.ts:97

Initial Delay in milliseconds.
This will also set the initial delay for keep-alive packets being sent to Redis.

**`default`** 0

___

### `Optional` socket_keepalive

• **socket_keepalive**? : *undefined | false | true*

*Inherited from [InitOptions](initoptions.md).[socket_keepalive](initoptions.md#optional-socket_keepalive)*

Defined in node_modules/@types/redis/index.d.ts:91

If set to `true`, the keep-alive functionality is enabled on the underlying socket.

**`default`** true

___

### `Optional` string_numbers

• **string_numbers**? : *undefined | false | true*

*Inherited from [InitOptions](initoptions.md).[string_numbers](initoptions.md#optional-string_numbers)*

Defined in node_modules/@types/redis/index.d.ts:72

Set to `true`, Node Redis will return Redis number values as Strings instead of javascript Numbers.
Useful if you need to handle big numbers (above `Number.MAX_SAFE_INTEGER` === 2^53).
Hiredis is incapable of this behavior, so setting this option to `true`
will result in the built-in javascript parser being used no matter
the value of the `parser` option.

**`default`** null

___

### `Optional` tls

• **tls**? : *any*

*Inherited from [InitOptions](initoptions.md).[tls](initoptions.md#optional-tls)*

Defined in node_modules/@types/redis/index.d.ts:170

An object containing options to pass to
[tls.connect](http://nodejs.org/api/tls.html#tls_tls_connect_port_host_options_callback)
to set up a TLS connection to Redis
(if, for example, it is set up to be accessible via a tunnel).

**`default`** null

___

### `Optional` url

• **url**? : *undefined | string*

*Inherited from [InitOptions](initoptions.md).[url](initoptions.md#optional-url)*

Defined in node_modules/@types/redis/index.d.ts:62

The URL of the Redis server.\
Format:
[redis[s]:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]\
More info avaliable at [IANA](http://www.iana.org/assignments/uri-schemes/prov/redis).

**`default`** null
