import { Base64 } from "js-base64";
import { JsonValue } from "type-fest";

export const encode = (data: JsonValue) => Base64.encode(JSON.stringify(data));

export const decode = (encodedData: string) => JSON.parse(Base64.decode(encodedData));
