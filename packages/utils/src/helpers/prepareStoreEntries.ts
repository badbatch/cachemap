import { type JsonValue } from 'type-fest';
import { ValueFormat } from '../enums.ts';
import { decode, encode } from './base64.ts';
import { decrypt, encrypt } from './encryption.ts';

export const prepareGetEntry = <T>(value: string, valueFormatting: ValueFormat, encryptionSecret?: string): T => {
  let getEntry: JsonValue | undefined;

  switch (true) {
    case valueFormatting === ValueFormat.String: {
      // JSON.parse returns any type.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      getEntry = JSON.parse(value) as JsonValue;
      break;
    }

    case valueFormatting === ValueFormat.Base64: {
      getEntry = decode(value);
      break;
    }

    case valueFormatting === ValueFormat.Ecrypt && !!encryptionSecret: {
      getEntry = decrypt(value, encryptionSecret);
      break;
    }

    default: {
      console.warn(
        '> cachemap :: valueFormatting set to "encrypt", but no encryption secret provided, falling back to JSON.parse.',
      );

      // JSON.parse returns any type.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      getEntry = JSON.parse(value) as JsonValue;
    }
  }

  // Most straight forward way to allow return value to be typed.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return getEntry as T;
};

export const prepareSetEntry = (value: JsonValue, valueFormatting: ValueFormat, encryptionSecret?: string): string => {
  let setEntry: string;

  switch (true) {
    case valueFormatting === ValueFormat.String: {
      setEntry = JSON.stringify(value);
      break;
    }

    case valueFormatting === ValueFormat.Base64: {
      setEntry = encode(value);
      break;
    }

    case valueFormatting === ValueFormat.Ecrypt && !!encryptionSecret: {
      setEntry = encrypt(value, encryptionSecret);
      break;
    }

    default: {
      console.warn(
        '> cachemap :: valueFormatting set to "encrypt", but no encryption secret provided, falling back to stringify.',
      );

      setEntry = JSON.stringify(value);
    }
  }

  return setEntry;
};
