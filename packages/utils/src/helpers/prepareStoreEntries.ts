import type { JsonValue } from 'type-fest';
import { decode, encode } from './base64.ts';
import { decrypt, encrypt } from './encryption.ts';

export const prepareGetEntry = <T>(value: string, encryptionSecret?: string) =>
  (encryptionSecret ? decrypt(value, encryptionSecret) : decode(value)) as T;

export const prepareSetEntry = (value: JsonValue, encryptionSecret?: string) =>
  encryptionSecret ? encrypt(value, encryptionSecret) : encode(value);
