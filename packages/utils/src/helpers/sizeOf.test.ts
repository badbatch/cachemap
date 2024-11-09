import { describe, expect, it } from '@jest/globals';
import { sizeOf } from './sizeOf.ts';

const addNumbers = (one: number, two: number) => one + two;

describe('sizeOf', () => {
  describe('when a string is passed in', () => {
    describe('when the string has characters', () => {
      it('should return the correct value', () => {
        expect(sizeOf('abc')).toBe(6);
      });
    });

    describe('when the string is empty', () => {
      it('should return 0', () => {
        expect(sizeOf('')).toBe(0);
      });
    });
  });

  describe('when null is passed in', () => {
    it('should return 4', () => {
      // eslint-disable-next-line unicorn/no-null
      expect(sizeOf(null)).toBe(4);
    });
  });

  describe('when undefined is passed in', () => {
    it('should return 0', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      expect(sizeOf(undefined)).toBe(0);
    });
  });

  describe('when a boolean is passed in', () => {
    it('should return 4', () => {
      expect(sizeOf(true)).toBe(4);
    });
  });

  describe('when a number is passed in', () => {
    it('should return 8', () => {
      expect(sizeOf(5)).toBe(8);
    });
  });

  describe('when NaN is passed in', () => {
    it('should return 8', () => {
      expect(sizeOf(Number.NaN)).toBe(8);
    });
  });

  describe('when a symbol is passed in', () => {
    it('should turn 2 * descriptor length', () => {
      const descriptor = 'abcd';
      expect(sizeOf(Symbol(descriptor))).toBe(2 * descriptor.length);
    });
  });

  describe('when a global symbol is passed in', () => {
    it('should return the correct value', () => {
      expect(sizeOf(Symbol.for('testKey'))).toBe(14);
    });
  });

  describe('when a function is passed in', () => {
    it('should return the correct value', () => {
      expect(sizeOf(addNumbers)).toBe(21);
    });
  });

  describe('when BigInt is passed in', () => {
    it('should return the correct value', () => {
      expect(sizeOf(BigInt(21_474_836_480))).toBe(11);
    });
  });

  describe('when an regex is passed in', () => {
    it('should return the correct value', () => {
      expect(sizeOf(/^[A-Za-z]/g)).toBe(12);
    });
  });

  describe('when a map is passed in', () => {
    it('should return the correct value', () => {
      const map = new Map([['key1', 'abc']]);
      expect(sizeOf(map)).toBe(10);
    });
  });

  describe('when a set is passed in', () => {
    it('should return the correct value', () => {
      const set = new Set(['a', 'b', 'c']);
      expect(sizeOf(set)).toBe(6);
    });
  });

  describe('when an array is passed in', () => {
    describe('when the array has no entries', () => {
      it('should return 0', () => {
        expect(sizeOf([])).toBe(0);
      });
    });

    describe('when the array has string entries', () => {
      it('should return the correct value', () => {
        expect(sizeOf(['a', 'b', 'c'])).toBe(6);
      });
    });

    describe('when the array has null entries', () => {
      it('should return the correct value', () => {
        // eslint-disable-next-line unicorn/no-null
        expect(sizeOf([null])).toBe(4);
      });
    });

    describe('when the array has undefined entries', () => {
      it('should return 0', () => {
        expect(sizeOf([undefined])).toBe(0);
      });
    });

    describe('when the array has boolean entries', () => {
      it('should return the correct value', () => {
        expect(sizeOf([true])).toBe(4);
      });
    });

    describe('when the array has number entries', () => {
      it('should return the correct value', () => {
        expect(sizeOf([5, 55])).toBe(16);
      });
    });

    describe('when the array has NaN entries', () => {
      it('should return the correct value', () => {
        expect(sizeOf([Number.NaN])).toBe(8);
      });
    });

    describe('when the array has symbol entries', () => {
      it('should return the correct value', () => {
        const descriptor = 'abcd';
        expect(sizeOf([Symbol(descriptor)])).toBe(8);
      });
    });

    describe('when the array has global symbol entries', () => {
      it('should return the correct value', () => {
        expect(sizeOf([Symbol.for('testKey')])).toBe(14);
      });
    });

    describe('when the array has function entries', () => {
      it('should return the correct value', () => {
        expect(sizeOf([addNumbers])).toBe(21);
      });
    });

    describe('when the array has BigInt entries', () => {
      it('should return the correct value', () => {
        expect(sizeOf([BigInt(21_474_836_480)])).toBe(11);
      });
    });

    describe('when the array has regex entries', () => {
      it('should return the correct value', () => {
        expect(sizeOf([/^[A-Za-z]/g])).toBe(12);
      });
    });

    describe('when the array has map entries', () => {
      it('should return the correct value', () => {
        const map = new Map([['key1', 'abc']]);
        expect(sizeOf([map])).toBe(10);
      });
    });

    describe('when the array has set entries', () => {
      it('should return the correct value', () => {
        const set = new Set(['a', 'b', 'c']);
        expect(sizeOf([set])).toBe(10);
      });
    });

    describe('when the array has typed array entries', () => {
      it('should return the correct value', () => {
        expect(sizeOf([new Int8Array([1, 2, 3, 4, 5])])).toBe(5);
      });
    });

    describe('when the array has object entries', () => {
      it('should return the correct value', () => {
        expect(sizeOf([{ 1: 'abc' }])).toBe(10);
      });
    });
  });

  describe('when an object is passed in', () => {
    describe('when the object has no properties', () => {
      it('should return 4', () => {
        expect(sizeOf({})).toBe(4);
      });
    });

    describe('when the object has a string value', () => {
      it('should return the correct value', () => {
        const obj = { 1: 'abc' };
        expect(sizeOf(obj)).toBe(10);
      });
    });

    describe('when the object has a null value', () => {
      it('should return the correct value', () => {
        // eslint-disable-next-line unicorn/no-null
        const obj = { 1: null };
        expect(sizeOf(obj)).toBe(8);
      });
    });

    describe('when the object has undefined value', () => {
      it('should return 0', () => {
        const obj = { 1: undefined };
        expect(sizeOf(obj)).toBe(4);
      });
    });

    describe('when the object has boolean value', () => {
      it('should return the correct value', () => {
        const obj = { 1: true };
        expect(sizeOf(obj)).toBe(8);
      });
    });

    describe('when the object has number value', () => {
      it('should return the correct value', () => {
        const obj = { 1: 0 };
        expect(sizeOf(obj)).toBe(12);
      });
    });

    describe('when the object has NaN value', () => {
      it('should return the correct value', () => {
        const obj = { 1: Number.NaN };
        expect(sizeOf(obj)).toBe(12);
      });
    });

    describe('when the object has symbol value', () => {
      it('should return the correct value', () => {
        const descriptor = 'abcd';
        const obj = { 1: Symbol(descriptor) };
        expect(sizeOf(obj)).toBe(12);
      });
    });

    describe('when the object has global symbol value', () => {
      it('should return the correct value', () => {
        const obj = { 1: Symbol.for('testKey') };
        expect(sizeOf(obj)).toBe(18);
      });
    });

    describe('when the object has function value', () => {
      it('should return the correct value', () => {
        const obj = { 1: addNumbers };
        expect(sizeOf(obj)).toBe(25);
      });
    });

    describe('when the object has BigInt value', () => {
      it('should return the correct value', () => {
        const obj = { 1: BigInt(21_474_836_480) };
        expect(sizeOf(obj)).toBe(15);
      });
    });

    describe('when the object has regex value', () => {
      it('should return the correct value', () => {
        const obj = { 1: /^[A-Za-z]/g };
        expect(sizeOf(obj)).toBe(16);
      });
    });

    describe('when the object has map value', () => {
      it('should return the correct value', () => {
        const map = new Map([['key1', 'abc']]);
        const obj = { 1: map };
        expect(sizeOf(obj)).toBe(14);
      });
    });

    describe('when the object has set value', () => {
      it('should return the correct value', () => {
        const set = new Set(['a', 'b', 'c']);
        const obj = { 1: set };
        expect(sizeOf(obj)).toBe(14);
      });
    });

    describe('when the object has object value', () => {
      it('should return the correct value', () => {
        const obj = { 1: { 1: 'abc' } };
        expect(sizeOf(obj)).toBe(14);
      });
    });

    describe('when the object has typed array value', () => {
      it('should return the correct value', () => {
        const obj = { 1: new Int8Array([1, 2, 3, 4, 5]) };
        expect(sizeOf(obj)).toBe(9);
      });
    });
  });

  describe('when a typed array is passed in', () => {
    describe.each`
      TypedArray      | expected
      ${Int8Array}    | ${5}
      ${Uint8Array}   | ${5}
      ${Uint16Array}  | ${10}
      ${Int16Array}   | ${10}
      ${Uint32Array}  | ${20}
      ${Int32Array}   | ${20}
      ${Float32Array} | ${20}
      ${Float64Array} | ${40}
    `('when the typed array is $TypedArray.name', ({ TypedArray, expected }) => {
      it('should return the correct value', () => {
        // @ts-expect-error 'TypedArray' is of type 'unknown'

        expect(sizeOf(new TypedArray([1, 2, 3, 4, 5]))).toBe(expected);
      });
    });
  });
});
