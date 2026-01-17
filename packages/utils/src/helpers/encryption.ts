import CryptoJS from 'crypto-js';
import { type JsonValue } from 'type-fest';

export const encrypt = (data: JsonValue, secret: string): string =>
  CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();

export const decrypt = (encryptedData: string, secret: string): JsonValue =>
  // JSON.parse returns any type.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  JSON.parse(CryptoJS.AES.decrypt(encryptedData, secret).toString(CryptoJS.enc.Utf8)) as JsonValue;
