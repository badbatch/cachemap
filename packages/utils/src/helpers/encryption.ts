import CryptoJS from 'crypto-js';
import { type JsonValue } from 'type-fest';

export const encrypt = (data: JsonValue, secret: string) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();

export const decrypt = (encryptedData: string, secret: string) =>
  JSON.parse(CryptoJS.AES.decrypt(encryptedData, secret).toString(CryptoJS.enc.Utf8)) as JsonValue;
