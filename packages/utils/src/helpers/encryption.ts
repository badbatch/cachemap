import CryptoJS from 'crypto-js';

export const encrypt = (data: unknown, secret: string): string =>
  CryptoJS.AES.encrypt(JSON.stringify(data), secret).toString();

export const decrypt = <T>(encryptedData: string, secret: string): T =>
  // JSON.parse returns any type.
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  JSON.parse(CryptoJS.AES.decrypt(encryptedData, secret).toString(CryptoJS.enc.Utf8)) as T;
