import CryptoJS, { AES } from "crypto-js";
import { JsonValue } from "type-fest";

export const encrypt = (data: JsonValue, secret: string) => AES.encrypt(JSON.stringify(data), secret).toString();

export const decrypt = (encryptedData: string, secret: string) =>
  JSON.parse(AES.decrypt(encryptedData, secret).toString(CryptoJS.enc.Utf8));
