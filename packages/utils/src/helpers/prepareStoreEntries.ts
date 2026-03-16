import { ValueFormat } from '../enums.ts';
import { decode, encode } from './base64.ts';
import { decrypt, encrypt } from './encryption.ts';

export const prepareGetEntry = <T>(value: string, valueFormatting: ValueFormat, encryptionSecret?: string): T => {
  let getEntry: T;

  switch (true) {
    case valueFormatting === ValueFormat.String: {
      // JSON.parse returns any type.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      getEntry = JSON.parse(value) as T;
      break;
    }

    case valueFormatting === ValueFormat.Base64: {
      getEntry = decode<T>(value);
      break;
    }

    case valueFormatting === ValueFormat.Encrypt && !!encryptionSecret: {
      getEntry = decrypt<T>(value, encryptionSecret);
      break;
    }

    default: {
      console.warn(
        '> cachemap :: valueFormatting set to "encrypt", but no encryption secret provided, falling back to JSON.parse.',
      );

      // JSON.parse returns any type.
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      getEntry = JSON.parse(value) as T;
    }
  }

  return getEntry;
};

export const prepareSetEntry = (value: unknown, valueFormatting: ValueFormat, encryptionSecret?: string): string => {
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

    case valueFormatting === ValueFormat.Encrypt && !!encryptionSecret: {
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
