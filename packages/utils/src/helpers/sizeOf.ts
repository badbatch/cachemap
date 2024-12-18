import { isObjectLike, isRegExp, isTypedArray } from 'lodash-es';
import { type TypedArray } from 'type-fest';

const ECMA_SIZES = {
  BOOLEAN: 4,
  BYTES: 4,
  NUMBER: 8,
  STRING: 2,
} as const;

const convertToObject = (obj: Map<unknown, unknown> | Set<unknown>): object => {
  if (obj instanceof Map) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Object.fromEntries(obj);
  }

  return [...obj];
};

const visitor = (obj: object, callback: (value: unknown) => object | false | undefined) => {
  for (const key of Object.keys(obj)) {
    // @ts-expect-error 'string' can't be used to index type '{}'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newValue = callback(obj[key]) ?? obj[key];

    if (newValue === false) {
      return;
    }

    if (isObjectLike(newValue) && !isRegExp(newValue)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      visitor(newValue, callback);
    }
  }
};

const utf16leToBytes = (value: string) => {
  let c: number, hi: number, lo: number;
  const byteArray = [];

  for (let index = 0; index < value.length; ++index) {
    // Based on surrounding code, this cannot be undefined.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    c = value.codePointAt(index)!;
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo, hi);
  }

  return byteArray;
};

const sizeComplexObject = (obj: object) => {
  let totalSize = 0;

  try {
    if (isTypedArray(obj)) {
      // isTypedArray does not support type guard.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const typedArray = obj as TypedArray;
      return typedArray.length * typedArray.BYTES_PER_ELEMENT;
    }

    let convertedObj = obj;

    if (obj instanceof Map || obj instanceof Set) {
      convertedObj = convertToObject(obj);
    }

    if (!Array.isArray(convertedObj)) {
      totalSize += ECMA_SIZES.BYTES;
    }

    visitor(convertedObj, (value: unknown) => {
      if (isTypedArray(value)) {
        // isTypedArray does not support type guard.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const typedArray = value as TypedArray;
        totalSize += typedArray.length * typedArray.BYTES_PER_ELEMENT;
        return false;
      }

      if (!isObjectLike(value) || isRegExp(value)) {
        totalSize += sizeSimpleType(value);
        return;
      }

      if (!Array.isArray(value)) {
        totalSize += ECMA_SIZES.BYTES;

        if (value instanceof Map || value instanceof Set) {
          return convertToObject(value);
        }
      }

      return;
    });
  } catch {
    // no catch
  }

  return totalSize;
};

const sizeSimpleType = (value: unknown) => {
  const objectList: object[] = [];
  const stack = [value];
  let bytes = 0;

  while (stack.length > 0) {
    const stackEntry = stack.pop();

    switch (true) {
      case typeof stackEntry === 'boolean': {
        bytes += ECMA_SIZES.BOOLEAN;
        break;
      }

      case typeof stackEntry === 'string': {
        bytes += utf16leToBytes(stackEntry).length;
        break;
      }

      case typeof stackEntry === 'number': {
        bytes += ECMA_SIZES.NUMBER;
        break;
      }

      case typeof stackEntry === 'symbol': {
        // Based on surrounding code, value will be a symbol.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const castValue = value as symbol;
        // Based on surrounding code, value will not be undefined.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const isGlobalSymbol = Symbol.keyFor(castValue)!;

        bytes += isGlobalSymbol
          ? // Based on surrounding code, value will not be undefined.
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Symbol.keyFor(castValue)!.length * ECMA_SIZES.STRING
          : (castValue.toString().length - 8) * ECMA_SIZES.STRING;

        break;
      }

      case typeof stackEntry === 'bigint': {
        bytes += stackEntry.toString().length;
        break;
      }

      case typeof stackEntry === 'function': {
        // typescript is not deriving type of stack entry from case.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        bytes += (stackEntry as () => unknown).toString().length;
        break;
      }

      case stackEntry === null: {
        bytes += ECMA_SIZES.BYTES;
        break;
      }

      case value instanceof RegExp: {
        return value.toString().length;
      }

      case stackEntry !== null && typeof stackEntry === 'object' && !objectList.includes(stackEntry): {
        const castStackEntry = stackEntry;
        objectList.push(castStackEntry);

        for (const index in castStackEntry) {
          // @ts-expect-error 'string' can't be used to index type '{}'
          stack.push(castStackEntry[index]);
        }

        break;
      }
    }
  }

  return bytes;
};

export const sizeOf = (value: unknown) =>
  // isObjectLike does not support type guard.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  isObjectLike(value) && !isRegExp(value) ? sizeComplexObject(value as object) : sizeSimpleType(value);
