import { expect, jest } from '@jest/globals';
import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64';
import { ValueFormat } from '../enums.ts';
import { prepareGetEntry, prepareSetEntry } from './prepareStoreEntries.ts';

const payload = {
  alpha: 'bravo',
  charlie: ['delta'],
};

describe('prepareGetEntry', () => {
  describe('when valueFormattingx is ValueFormat.String', () => {
    it('should JSON.parse the value', () => {
      expect(prepareGetEntry(JSON.stringify(payload), ValueFormat.String)).toEqual(payload);
    });
  });

  describe('when valueFormattingx is ValueFormat.Base64', () => {
    it('should base64 decode and JSON.parse the value', () => {
      expect(prepareGetEntry(Base64.encode(JSON.stringify(payload)), ValueFormat.Base64)).toEqual(payload);
    });
  });

  describe('when valueFormattingx is ValueFormat.Ecrypt and encryptionSecret is provided', () => {
    it('should decrypt and JSON.parse the value', () => {
      expect(
        prepareGetEntry(
          CryptoJS.AES.encrypt(JSON.stringify(payload), 'secret').toString(),
          ValueFormat.Ecrypt,
          'secret'
        )
      ).toEqual(payload);
    });
  });

  describe('when valueFormattingx is ValueFormat.Ecrypt and encryptionSecret is not provided', () => {
    let realConsoleWwarn: (typeof console)['warn'];

    beforeEach(() => {
      realConsoleWwarn = console.warn;
      console.warn = jest.fn();
    });

    afterEach(() => {
      console.warn = realConsoleWwarn;
    });

    it('should JSON.parse the value', () => {
      expect(prepareGetEntry(JSON.stringify(payload), ValueFormat.Ecrypt)).toEqual(payload);
    });

    it('should log the expected warning', () => {
      prepareGetEntry(JSON.stringify(payload), ValueFormat.Ecrypt);

      expect(console.warn).toHaveBeenCalledWith(
        '> cachemap :: valueFormatting set to "encrypt", but no encryption secret provided, falling back to JSON.parse.'
      );
    });
  });
});

describe('prepareSetEntry', () => {
  describe('when valueFormattingx is ValueFormat.String', () => {
    it('should JSON.stringify the value', () => {
      expect(prepareSetEntry(payload, ValueFormat.String)).toMatchInlineSnapshot(
        `"{"alpha":"bravo","charlie":["delta"]}"`
      );
    });
  });

  describe('when valueFormattingx is ValueFormat.Base64', () => {
    it('should JSON.stringify and base64 encode the value', () => {
      expect(prepareSetEntry(payload, ValueFormat.Base64)).toMatchInlineSnapshot(
        `"eyJhbHBoYSI6ImJyYXZvIiwiY2hhcmxpZSI6WyJkZWx0YSJdfQ=="`
      );
    });
  });

  describe('when valueFormattingx is ValueFormat.Ecrypt and encryptionSecret is provided', () => {
    it('should JSON.stringify and encrypt the value', () => {
      expect(typeof prepareSetEntry(payload, ValueFormat.Ecrypt, 'secret')).toBe('string');
    });
  });

  describe('when valueFormattingx is ValueFormat.Ecrypt and encryptionSecret is not provided', () => {
    let realConsoleWwarn: (typeof console)['warn'];

    beforeEach(() => {
      realConsoleWwarn = console.warn;
      console.warn = jest.fn();
    });

    afterEach(() => {
      console.warn = realConsoleWwarn;
    });

    it('should JSON.stringify the value', () => {
      expect(prepareSetEntry(payload, ValueFormat.Ecrypt)).toMatchInlineSnapshot(
        `"{"alpha":"bravo","charlie":["delta"]}"`
      );
    });

    it('should log the expected warning', () => {
      prepareSetEntry(payload, ValueFormat.Ecrypt);

      expect(console.warn).toHaveBeenCalledWith(
        '> cachemap :: valueFormatting set to "encrypt", but no encryption secret provided, falling back to stringify.'
      );
    });
  });
});
