import { Base64 } from 'js-base64';
import { type JsonValue } from 'type-fest';

export const encode = (data: JsonValue): string => Base64.encode(JSON.stringify(data));

// JSON.parse returns any type.
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export const decode = (encodedData: string): JsonValue => JSON.parse(Base64.decode(encodedData)) as JsonValue;
